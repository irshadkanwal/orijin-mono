import { Injectable } from '@nestjs/common';
import { createUniqueIdOfName, OrmOptions } from '../entities/utils/utils';
import { ObjectId } from '../entities/utils/ObjectId';
import { FirestoreOrmService } from './firestoreOrm.service';
import Organisation from '../entities/org/Organisation';
import Workspace from '../entities/org/Workspace';
import Account from '../entities/org/Accounts';
import { plainToInstance } from 'class-transformer';
import { collectionKeys } from '../v1utils/dbMappingUtils';

@Injectable()
export class FirestoreWorkspaceService {
  private _firestoreOrmService: FirestoreOrmService;

  constructor(firestoreOrmService: FirestoreOrmService) {
    this._firestoreOrmService = firestoreOrmService;
  }

  async createWorkspace(
    name: string,
    configPrefix: string,
    organisationId: ObjectId,
    uniqueId: string,
    dbOps: OrmOptions,
    organisationObj: Organisation = undefined,
  ): Promise<Workspace> {
    const organisation =
      organisationObj ||
      (await this._firestoreOrmService.getBy(
        organisationId,
        Organisation,
        dbOps,
      ));

    const newWorkspace = new Workspace();
    newWorkspace.name = name;
    newWorkspace.organisation = organisationId;
    newWorkspace.configPrefix = configPrefix;
    newWorkspace.setCustomId(uniqueId)

    let commitHere = false;
    if (!dbOps?.tx?.transaction) {
      dbOps.tx = this._firestoreOrmService.getTransaction();
      commitHere = true;
    }

    if (uniqueId) {
      const dup = await this._firestoreOrmService.getById(
        uniqueId,
        Workspace,
        dbOps,
      );
      if (dup) {
        throw new Error('workspace with id already exists: ' + uniqueId);
      }
      newWorkspace.setCustomId(uniqueId);
    } else {
      const id = organisationId.id + '_' + createUniqueIdOfName(name);
      const dup = await this._firestoreOrmService.getById(id, Workspace, dbOps);
      if (dup) {
        throw new Error('workspace with id already exists: ' + id);
      }
      newWorkspace.setCustomId(id);
    }

    const newWorkspaceResponse: Workspace =
      await this._firestoreOrmService.create(newWorkspace, dbOps);

    await Promise.all(
      organisation.admins.map((admin) => {
        return this.addWorkspaceUser(
          newWorkspaceResponse.id,
          admin,
          dbOps,
          newWorkspaceResponse,
          true,
        );
      }),
    );
    organisation.addWorkspace(newWorkspaceResponse.id);
    await this._firestoreOrmService.update(organisation, dbOps);

    if (commitHere) {
      await this._firestoreOrmService.commit(dbOps.tx);
    }
    return newWorkspaceResponse;
  }

  async addWorkspaceUser(
    workspaceId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
    workspaceObj: Workspace = undefined,
    isRoleAdd: boolean = false,
    userObj: Account = undefined,
  ): Promise<void> {
    let commitHere = false;

    if (!dbOps?.tx?.transaction) {
      dbOps.tx = this._firestoreOrmService.getTransaction();
      commitHere = true;
    }

    const user: Account =
      userObj ??
      (await this._firestoreOrmService.getBy(userId, Account, dbOps));

    const workspace: Workspace =
      workspaceObj ??
      (await this._firestoreOrmService.getBy(workspaceId, Workspace, dbOps));

    if (!workspace.hasUser(user.id)) {
      console.log(
        `Workspace not added, adding ${workspaceId.id} ${userId.labelShort}`,
      );
      workspace.addUser(user.id);
      await this._firestoreOrmService.update(workspace, dbOps);
    }

    if (!user.hasWorkSpace(workspace.id)) {
      console.log(
        `Adding workspace to user ${workspaceId.id} ${userId.labelShort}`,
      );
      user.addWorkspace(workspace.id);
      await this._firestoreOrmService.update(user, dbOps);
    }

    if (!user.hasOrganisation(workspace.organisation)) {
      console.log(
        `Adding organisation to user ${workspaceId.id} ${userId.labelShort}`,
      );
      user.addOrganisation(workspace.organisation);
      await this._firestoreOrmService.update(user, dbOps);
    }

    if (isRoleAdd) {
      await this.addWorkspaceUserRole(
        {
          workspace,
          role: 'adminAll',
          user,
        },
        dbOps,
      );
    }

    if (commitHere) {
      await this._firestoreOrmService.commit(dbOps.tx);
    }
  }

  async addWorkspaceUserRole(
    roleParams: {
      workspace: Workspace;
      role: string;
      user: Account;
    },
    dbOps: OrmOptions,
  ) {
    roleParams.user.setWorkspaceRole(roleParams.workspace.id, roleParams.role);
    const resp = await this._firestoreOrmService.update(roleParams.user, dbOps);
    return resp;
  }

  async getWorkspaceById(id: string, dbOps: OrmOptions): Promise<Workspace> {
    return await this._firestoreOrmService.getById(id, Workspace, dbOps);
  }

  async getAllWorkspaceByOrganisationId(id) {
    const filters = [];
    if (id) {
      filters.push({
        key: 'organisation',
        value: {
          id: id,
          refcollection: collectionKeys.organisations,
          isPreviousVersion: false
        },
        operation: '==',
      });
    }
    const data = await this._firestoreOrmService.searchBy(Workspace, {
      filters,
    });
    // console.log(data.values);
    return data.values;
  }

}
