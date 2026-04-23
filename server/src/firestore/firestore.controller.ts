import { FirestoreUserService } from './services/firestoreUser.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Farm } from '../farms/models/farms.model';
import { FirestoreFarmInspectionDto } from './dto/firestore.farmInspection.dto';
import { FirestoreService } from './firestore.service';
import {
  FireStoreCreateUserDto,
  FireStoreDeleteUsersDto,
  FireStoreUpdateUserDto,
} from './dto/firestore.user.dto';
import { FirestoreFarmInspectionService } from './firestore.farm.inspection.service';
import { FirebaseAuthService } from './firebaseAuth.service';
import { Request, Response } from 'express';
import { FirestoreUsersFilter } from './dto/firestore.users.filter.dto';
import { SendGridService } from '../common/service/send-grid/send-grid.service';
import { FARM_INSPECTION_URL } from '../common/constants';
import { FirestoreOrgnisationService } from './services/firestoreOrgnisation.service';
import Organisation from './entities/org/Organisation';
import {
  constructDefaultWorkspaceNameMaster,
  constructDefaultWorkspaceNameTest,
  IFilter,
  OrderOption,
  OrmOptions as OrmOptionsV2,
} from './entities/utils/utils';
import { FirestoreWorkspaceService } from './services/firestoreWorkspace.service';
import Workspace from './entities/org/Workspace';
import Account from './entities/org/Accounts';
import { FirestoreOrmService } from './services/firestoreOrm.service';
import { ObjectId as V2ObjectId } from './entities/utils/ObjectId';
import { collectionKeys } from './entities/utils/DbMappingUtils';
import { FirestoreOrganisationFilter } from './dto/firestore.organisations.filter.dto';
import { FireStoreCreateUpdateOrganisationDto } from './dto/firestore.organisation.dto';
import { IUserInfo } from './entities/utils/types';
import { FirestoreOrganisationConfig } from './services/firestoreOrganisationConfig.service';
import { FieldTaskQuery } from './dto/firebase.query.dto';

@Controller()
export class FirestoreController {
  logger = new Logger(FirestoreController.name);

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly farmInspectionService: FirestoreFarmInspectionService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly sendGridService: SendGridService,
    private readonly firestoreOrganisationService: FirestoreOrgnisationService,
    private readonly firestoreWorkspaceService: FirestoreWorkspaceService,
    private readonly firestoreOrmService: FirestoreOrmService,
    private readonly firestoreUserService: FirestoreUserService,
    private readonly firestoreOrganisationConfigService: FirestoreOrganisationConfig,
  ) { }

  @Get('myAllowedOrgs')
  async allowedOrgs(@Req() req: Request): Promise<string[]> {
    const token = req.headers['authorization']?.split(' ')[1];
    return await this.firestoreService.verifyTokenAndOrganisations(token);
  }

  @Post(FARM_INSPECTION_URL)
  postFarmInspectionResult(
    @Param('org') org: string,
    @Body() body: FirestoreFarmInspectionDto,
  ): Promise<Farm[]> {
    // this.logger.log(body?.farm);
    // TODO: WIP
    return this.farmInspectionService.process(body, org);
  }

  @Get('isAdmin')
  async isAdmin(@Req() req: Request): Promise<boolean> {
    const token = req.headers['authorization']?.split(' ')[1];
    return await this.firestoreService.isAdminAndVerifyToken(token);
  }

  @Get(':org?/users')
  async users(
    @Req() req: Request,
    @Param('org') org: string,
    @Query() queryFilters: FirestoreUsersFilter,
  ): Promise<{ data: Account[]; count: number }> {
    const { userDetails, isAdmin } =
      await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);

    if (!isAdmin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const currentUser = {
      id: userDetails.uid,
      refcollection: collectionKeys.platformusers,
    } as V2ObjectId;

    const ops: OrmOptionsV2 = {
      configKey: 'ltc',
      currentUser,
      tx: null,
      fetchTotal: true,
    };

    const filters: IFilter[] = [];
    const ordering: OrderOption[] = [];

    if (queryFilters.sort) {
      ordering.push({
        key: queryFilters.sort,
        direction: queryFilters.sortOrder ?? 'desc',
      });
    }

    if (queryFilters.email) {
      filters.push({
        key: 'email',
        value: queryFilters.email,
        operation: '==',
      });
    }

    if (org) {
      filters.push({
        key: 'organisations',
        value: {
          id: org,
          refcollection: collectionKeys.organisations,
          isPreviousVersion: false,
        },
        operation: 'array-contains',
      });
    }

    const data = await this.firestoreOrmService.searchBy(Account, {
      filters,
      ordering,
      ops,
      limit: queryFilters.limit ? parseInt(queryFilters.limit) : undefined,
      offset: queryFilters.page ? parseInt(queryFilters.page) : undefined,
    });
    const users = data.values.map((user) => ({
      ...user,
      role:
        user.workspaceRole && Object.entries(user.workspaceRole).length > 0
          ? Object.entries(user.workspaceRole)
            .filter(([workspace, role]) => workspace.startsWith(org + '_'))
            ?.map(([workspace, role]: any) => role.replace(/ALL/i, ''))[0]
          : '',
    }));

    return { data: users, count: data.totalCount ?? data.values.length };
  }

  @Post(':org/users')
  async createUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('org') organisation: string,
    @Body() body: FireStoreCreateUserDto,
  ) {
    try {
      const { userDetails, isAdmin } =
        await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);

      if (!isAdmin) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if (!userDetails) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const email = body.email;
      const role =
        body.role.toLocaleLowerCase() === 'admin'
          ? body.role.toLocaleLowerCase()
          : body.role + 'ALL';
      const name = body.name;

      let firebaseUser: IUserInfo =
        await this.firebaseAuthService.getUserByEmail(email);
      const logPrefix = `::CREATEUSER::${email}:${name}:${role}`;
      let baseUser: Account;
      if (!firebaseUser) {
        console.log(`Firebase user doesn't exist, create one ${logPrefix}`);
        firebaseUser = await this.firebaseAuthService.signup({
          email,
          password: body.password,
          displayName: name,
        });
      } else {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'User already register' });
      }

      const workspaceNameMaster =
        constructDefaultWorkspaceNameMaster(organisation);
      const workspaceNameTest = constructDefaultWorkspaceNameTest(organisation);

      baseUser = await this.firestoreOrmService.findBy('email', email, Account);

      const tx = this.firestoreOrmService.getTransaction();
      const currentUser = new V2ObjectId(
        userDetails.uid,
        collectionKeys.platformusers,
      );
      const dbOps: OrmOptionsV2 = {
        tx,
        configKey: 'ltc',
        currentUser,
      };
      if (!baseUser) {
        console.log(`Our user dont exist, create one ${logPrefix}`);
        baseUser = await this.firestoreUserService.createAccount(
          firebaseUser.uid,
          email,
          dbOps,
        );
        baseUser.name = body.name;
        baseUser.uid = firebaseUser.uid;

        baseUser = await this.firestoreOrmService.update(baseUser, dbOps);
      }
      const ws_master: Workspace = await this.firestoreOrmService.getBy(
        {
          id: workspaceNameMaster,
          refcollection: collectionKeys.workspaces,
        } as V2ObjectId,
        Workspace,
        dbOps,
      );

      const ws_test: Workspace = await this.firestoreOrmService.getBy(
        {
          id: workspaceNameTest,
          refcollection: collectionKeys.workspaces,
        } as V2ObjectId,
        Workspace,
        dbOps,
      );
      if (role) {
        baseUser.setWorkspaceRole(ws_master.id, role);
        baseUser.setWorkspaceRole(ws_test.id, role);
        baseUser = await this.firestoreOrmService.update(baseUser, dbOps);
      }

      await this.firestoreOrganisationService.addOrganisationUser(
        ws_master.organisation,
        baseUser.id,
        dbOps,
        baseUser,
      );

      await this.firestoreWorkspaceService.addWorkspaceUser(
        ws_master.id,
        baseUser.id,
        dbOps,
        undefined,
        false,
        baseUser,
      );

      await this.firestoreWorkspaceService.addWorkspaceUser(
        ws_test.id,
        baseUser.id,
        dbOps,
        undefined,
        false,
        baseUser,
      );

      await this.firestoreOrmService.commit(tx);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User created successfully', user: baseUser });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message, error });
    }
  }

  @Patch(':org/users/:id?')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Param('org') organisation: string,
    @Body() body: FireStoreUpdateUserDto,
  ) {
    try {
      const { userDetails, isAdmin } =
        await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);

      if (!isAdmin) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if (!userDetails) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const currentUser = new V2ObjectId(
        userDetails.uid,
        collectionKeys.platformusers,
      );

      const tx = this.firestoreOrmService.getTransaction();
      const dbOps: OrmOptionsV2 = {
        configKey: 'ltc',
        currentUser,
        tx,
      };

      const workspaceNameMaster =
        constructDefaultWorkspaceNameMaster(organisation);
      const workspaceNameTest = constructDefaultWorkspaceNameTest(organisation);
      const ws_master: Workspace = await this.firestoreOrmService.getBy(
        {
          id: workspaceNameMaster,
          refcollection: collectionKeys.workspaces,
        } as V2ObjectId,
        Workspace,
        dbOps,
      );

      const ws_test: Workspace = await this.firestoreOrmService.getBy(
        {
          id: workspaceNameTest,
          refcollection: collectionKeys.workspaces,
        } as V2ObjectId,
        Workspace,
        dbOps,
      );

      const role = body?.role
        ? body.role.toLocaleLowerCase() === 'admin'
          ? body.role.toLocaleLowerCase()
          : body.role + 'ALL'
        : null;

      if (id && id !== '') {
        const baseUser = await this.firestoreOrmService.getById(id, Account);
        baseUser.name = body.name ?? baseUser.name;
        baseUser.email = body.email ?? baseUser.email;

        if (role) {
          baseUser.setWorkspaceRole(ws_master.id, role);
          baseUser.setWorkspaceRole(ws_test.id, role);
        }

        const resp = await this.firestoreUserService.updateUser(
          baseUser,
          dbOps,
        );
        res
          .status(HttpStatus.OK)
          .json({ message: 'User updated successfully', data: resp });
      } else if (body.ids && role) {
        for (const id of body.ids) {
          const baseUser = await this.firestoreOrmService.getById(id, Account);
          if (role) {
            baseUser.setWorkspaceRole(ws_master.id, role);
            baseUser.setWorkspaceRole(ws_test.id, role);
          }

          const resp = await this.firestoreUserService.updateUser(
            baseUser,
            dbOps,
          );
        }
        res
          .status(HttpStatus.OK)
          .json({ message: 'User updated successfully', data: null });
      }
      await this.firestoreOrmService.commit(tx);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message, error });
    }
  }

  @Delete(':org/users/:id?')
  async removeUserFully(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('org') organisation: string,
    @Body() body: FireStoreDeleteUsersDto,
  ): Promise<any> {
    try {
      const dbOps: OrmOptionsV2 = {
        tx: undefined,
        configKey: undefined,
        currentUser: undefined,
      };
      if (body.ids && body.ids.length > 0) {
        for (const id of body.ids) {
          const tx = this.firestoreOrmService.getTransaction();
          dbOps.tx = tx;
          const resp = await this.firestoreUserService.removeUser(id, dbOps);
          await this.firestoreOrmService.commit(tx);
        }
        return res.status(HttpStatus.OK).json({
          message: 'Users removed successfully',
          data: null,
        });
      } else if (id) {
        const tx = this.firestoreOrmService.getTransaction();
        dbOps.tx = tx;
        const resp = await this.firestoreUserService.removeUser(id, dbOps);
        await this.firestoreOrmService.commit(tx);

        return res.status(HttpStatus.OK).json({
          message: 'User removed successfully',
          data: resp,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'No user ID(s) provided',
        });
      }
    } catch (e) {
      console.log('CreateUser.ERROR', e);
      res.status(500).send(e.message || 'failed.');
    }
  }

  @Get('organisations')
  async organizations(
    @Query() queryFilters: FirestoreOrganisationFilter,
  ): Promise<{ data: Organisation[]; count: number }> {
    const ops: OrmOptionsV2 = {
      configKey: undefined,
      currentUser: undefined,
      fetchTotal: true,
    };
    const filters: IFilter[] = [];
    const ordering: OrderOption[] = [];

    if (queryFilters.sort) {
      ordering.push({
        key: queryFilters.sort,
        direction: queryFilters.sortOrder ?? 'desc',
      });
    }

    if (queryFilters.name) {
      filters.push({
        key: 'name',
        value: queryFilters.name,
        operation: '==',
      });
    }

    const data = await this.firestoreOrmService.searchBy(Organisation, {
      filters,
      ordering,
      ops,
      limit: queryFilters.limit ? parseInt(queryFilters.limit) : undefined,
      offset: queryFilters.page ? parseInt(queryFilters.page) : undefined,
    });

    return { data: data.values, count: data.totalCount ?? data.values.length };
  }

  @Post('organisations')
  async createOrganization(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: Organisation,
  ) {
    try {
      const { userDetails, isAdmin } =
        await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);

      if (!isAdmin) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if (!userDetails) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const currentUser = {
        id: userDetails.uid,
        refcollection: collectionKeys.platformusers,
      } as V2ObjectId;

      const dbOps: OrmOptionsV2 = {
        configKey: 'ltc',
        currentUser,
        tx: null,
      };

      const data = await this.firestoreOrganisationService.createOrganisation(
        body.name,
        body.name,
        dbOps,
      );

      await this.firestoreOrganisationService.addOrganisationUser(
        data.id,
        new V2ObjectId(userDetails.uid, collectionKeys.platformusers),
        dbOps,
      );

      const workspaceNameMaster = constructDefaultWorkspaceNameMaster(
        data.id.id,
      );
      const workspaceNameTest = constructDefaultWorkspaceNameTest(data.id.id);
      try {
        dbOps.tx = this.firestoreOrmService.getTransaction();
        await this.firestoreWorkspaceService.createWorkspace(
          'test',
          'ltc',
          data.id,
          workspaceNameTest,
          dbOps,
        );

        this.firestoreOrmService.commit(dbOps.tx);
      } catch (err) {
        console.log(err);
        throw new HttpException(
          "Workspace couldn't be created",
          HttpStatus.BAD_REQUEST,
        );
      }

      try {
        dbOps.tx = this.firestoreOrmService.getTransaction();
        await this.firestoreWorkspaceService.createWorkspace(
          'master',
          'ltc',
          data.id,
          workspaceNameMaster,
          dbOps,
        );

        this.firestoreOrmService.commit(dbOps.tx);
      } catch (err) {
        console.log(err);
        throw new HttpException(
          "Workspace couldn't be created",
          HttpStatus.BAD_REQUEST,
        );
      }

      const organisation = await this.firestoreOrmService.getBy(
        data.id,
        Organisation,
        dbOps,
      );

      return res.status(HttpStatus.CREATED).json({
        message: 'Organisation created successfully',
        data: organisation,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message, error });
    }
  }

  @Patch('organisations/:id')
  async updateOrganization(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: FireStoreCreateUpdateOrganisationDto,
  ) {
    try {
      const { userDetails, isAdmin } =
        await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);

      if (!isAdmin) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if (!userDetails) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const currentUser = {
        id: userDetails.uid,
        refcollection: collectionKeys.platformusers,
      } as V2ObjectId;

      const tx = this.firestoreOrmService.getTransaction();
      const dbOps: OrmOptionsV2 = {
        configKey: 'ltc',
        currentUser,
        tx,
      };

      const resp = {
        message: 'Organisation updated successfully',
        data: null,
      };

      const payload: Organisation = {
        id: new V2ObjectId(id, collectionKeys.organisations),
      } as Organisation;

      if (body.name) {
        payload.name = body.name;
        resp.data = await this.firestoreOrganisationService.updateOrganisation(
          payload,
          dbOps,
        );
      }

      if (body.userId) {
        resp.data = await this.firestoreOrganisationService.addOrganisationUser(
          payload.id,
          new V2ObjectId(body.userId, collectionKeys.platformusers),
          { ...dbOps, tx: undefined },
        );
        const workspaceNameMaster = constructDefaultWorkspaceNameMaster(id);
        const workspaceNameTest = constructDefaultWorkspaceNameTest(id);

        await this.firestoreWorkspaceService.addWorkspaceUser(
          new V2ObjectId(workspaceNameTest, collectionKeys.workspaces),
          new V2ObjectId(body.userId, collectionKeys.platformusers),
          { ...dbOps, tx: undefined },
          undefined,
          false,
          undefined,
        );

        await this.firestoreWorkspaceService.addWorkspaceUser(
          new V2ObjectId(workspaceNameMaster, collectionKeys.workspaces),
          new V2ObjectId(body.userId, collectionKeys.platformusers),
          { ...dbOps, tx: undefined },
          undefined,
          false,
          undefined,
        );

        if (!resp.data) {
          resp.message = 'User not added into organisation';
        } else {
          resp.message = 'User added into organisation successfully';
        }
      }

      if (body.isToAddWorkspaces) {
        const workspaceNameMaster = constructDefaultWorkspaceNameMaster(id);
        const workspaceNameTest = constructDefaultWorkspaceNameTest(id);
        const [wsMaster, wsTest] = await Promise.all([
          this.firestoreWorkspaceService.getWorkspaceById(
            workspaceNameMaster,
            dbOps,
          ),
          this.firestoreWorkspaceService.getWorkspaceById(
            workspaceNameTest,
            dbOps,
          ),
        ]);
        let organisation = await this.firestoreOrmService.getBy(
          payload.id,
          Organisation,
          dbOps,
        );

        dbOps.tx = this.firestoreOrmService.getTransaction();
        if (!wsMaster) {
          await this.firestoreWorkspaceService.createWorkspace(
            'master',
            'ltc',
            payload.id,
            workspaceNameMaster,
            dbOps,
          );
        } else {
          if (!organisation.hasWorkspace(wsMaster.id)) {
            organisation.addWorkspace(wsMaster.id);
            organisation = await this.firestoreOrmService.update(
              organisation,
              dbOps,
            );
          }
        }
        this.firestoreOrmService.commit(dbOps.tx);
        dbOps.tx = this.firestoreOrmService.getTransaction();
        if (!wsTest) {
          await this.firestoreWorkspaceService.createWorkspace(
            'test',
            'ltc',
            payload.id,
            workspaceNameTest,
            dbOps,
          );
        } else {
          if (!organisation.hasWorkspace(wsTest.id)) {
            organisation.addWorkspace(wsTest.id);
            organisation = await this.firestoreOrmService.update(
              organisation,
              dbOps,
            );
          }
        }
        this.firestoreOrmService.commit(dbOps.tx);
        resp.message = 'Workspaces added successfully';
      }

      await this.firestoreOrmService.commit(tx);
      res.status(HttpStatus.OK).json(resp);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message, error });
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Res() res: Response,
    @Body('email') email: string,
  ): Promise<any> {
    try {
      const respURL = await this.firebaseAuthService.sendPasswordResetEmail(
        email,
      );
      if (respURL) {
        const payload = {
          reset_url: respURL,
        };
        await this.sendGridService.sendMail(
          email,
          'Password Reset Request',
          null,
          null,
          payload,
        );
        return res
          .status(HttpStatus.OK)
          .json({ message: 'Reset Password Link Sent', url: respURL });
      }
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message, error });
    }
  }

  @Put('username/:id')
  async updateUsername(
    @Param('id') id: string,
    @Body('username') name: string,
  ) {
    const userRef = this.firestoreService
      .getDb()
      .collection('platformusers')
      .doc(id);
    await userRef.update({ name });
    return { message: 'Username updated successfully' };
  }

  @Delete('firebase/:workspace/:collection/:id')
  async deleteDocument(
    @Param('workspace') workspace: string,
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    return await this.firestoreService.deleteDocument(
      workspace,
      collection,
      id,
    );
  }
  @Get('firebase/documents')
  async getPaginatedDocuments(
    @Query() filters: FieldTaskQuery,
  ): Promise<{ data: any[]; count: number }> {
    return await this.firestoreService.getPaginatedDocuments(filters);
  }
  @Get('firebase/:workspace/:collection/:id')
  async getDocument(
    @Param('workspace') workspace: string,
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    return await this.firestoreService.getDocument(workspace, collection, id);
  }

  @Post('firebase/:workspace/:collection')
  async createDocument(
    @Param('workspace') workspace: string,
    @Param('collection') collection: string,
    @Body() payload: any,
    @Query('id') id?: string,
  ) {
    return await this.firestoreService.createDocument(
      workspace,
      collection,
      payload,
      id,
    );
  }
  @Put('firebase/:workspace/:collection/:id')
  async updateDocument(
    @Param('workspace') workspace: string,
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() payload: any,
  ) {
    return await this.firestoreService.updateDocument(
      workspace,
      collection,
      id,
      payload,
    );
  }
  @Get(':org/firebase/workspaces')
  async getWorkspacesAndCollections(@Param('org') organization: string) {
    return await this.firestoreService.getWorkspacesAndCollectionsForOrg(
      organization,
    );
  }

  @Get(':collection/firebase/collection-columns')
  async getCollectionColumns(@Param('collection') collection: string) {
    return this.firestoreService.getColumnsAndFiltersForCollection(collection);
  }

  @Get(':org/organisation-config/:id?')
  async getOrganisationConfig(
    @Param('org') org: string,
    @Param('id') id: string,
  ) {
    try {
      const orgId = new V2ObjectId(org, collectionKeys.organisation_config);
      return await this.firestoreOrganisationConfigService.getOrganisationConfig(orgId);
    } catch (error) {
      // Log the error
      console.error('Error fetching organisation config:', error);
      throw new InternalServerErrorException('Failed to retrieve organisation config');
    }
  }


  @Patch(':org/organisation-config/:id')
  async updateOrgConfigLocality(
    @Req() req: Request,
    @Res() res: Response,
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: { locality: string }, // Define the expected structure of `body`
  ) {
    try {
      const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);

      if (!userDetails) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid token',
        });
      }

      if (!isAdmin) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Unauthorized',
        });
      }

      const currentUser = {
        id: userDetails.uid,
        refcollection: collectionKeys.platformusers,
      } as V2ObjectId;

      const tx = this.firestoreOrmService.getTransaction();
      const dbOps: OrmOptionsV2 = {
        configKey: 'ltc',
        currentUser,
        tx,
      };

      const orgId = new V2ObjectId(org, collectionKeys.organisation_config);

      // Update the config with locality
      const result = await this.firestoreOrganisationConfigService.updateOrganisationConfig(
        orgId,
        body, // Pass the locality data directly
        dbOps,
      );

      await this.firestoreOrmService.commit(tx);

      return res.status(HttpStatus.OK).json({
        message: 'Organisation config locality updated successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error updating organisation config:', error); // Log the error for debugging
      const status = error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        message: error.message || 'Failed to update organisation configuration',
      });
    }
  }

  @Get(':org/workspaces')
  async getAllWorkSpacesByOrganisationId(
    @Param('org') org: string,
  ) {
    return this.firestoreWorkspaceService.getAllWorkspaceByOrganisationId(org)
  }
}
