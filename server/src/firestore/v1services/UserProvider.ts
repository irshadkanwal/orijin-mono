import { ObjectId } from '../v1entities/utis/ObjectId';
import { OrmOptions } from '../v1utils/utils';
import AccountV1 from '../v1entities/org/AccountV1';
import WorkspaceV1 from '../v1entities/org/WorkspaceV1';
import OrganisationV1 from '../v1entities/org/OrganisationV1';
import { GoogleApiCredential } from '../v1entities/utis/types';
import { collectionKeys } from '../v1utils/dbMappingUtils';
import OrmProvider from './OrmProvider';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserProvider {
  private ormProvider: OrmProvider;
  private authProvider: any;

  constructor(ormProvider: OrmProvider) {
    this.ormProvider = ormProvider;
  }

  isSuperUser = async (userId: ObjectId) => {
    const user = await this.getUserById(userId);

    // filtered via. db can this be Model Object?
    console.log(user.email);
    const superUserObject = await this.ormProvider.all('superusers');

    console.log(superUserObject);

    if (
      superUserObject.length > 0 &&
      superUserObject.some((su) => su.email === user.email)
    ) {
      return true;
    } else {
      return false;
    }
  };

  // isOrganisationAdmin = async (userId: ObjectId) => {
  //   const user = await this.getUserById(userId);
  //   if (user.organisation) {
  //     const organisation = await this.ormProvider.getBy(user.organisation.id, Organisation);

  //     if (organisation.admins.find(adminId => adminId.equals(userId))) {
  //       return true;
  //     }
  //   }

  //   return false;
  // };
  createAccount = async (
    uid: string,
    email: string,
    dbOps: OrmOptions,
  ): Promise<AccountV1> => {
    const newUser = new AccountV1();
    newUser.setCustomId(uid);
    if (email) {
      newUser.email = email;
    }
    const baseUserPromise = await this.ormProvider.create(newUser, dbOps);

    if (email) {
      baseUserPromise.id.labelShort = email;
      baseUserPromise.id.label = email;
      await this.ormProvider.update(newUser, dbOps);
    }

    return baseUserPromise;
  };

  getAuthenticatedUser = async (): Promise<AccountV1> => {
    const authUser = this.authProvider.user;
    if (!authUser) {
      throw new Error('User not logged in');
    }
    const baseUser = await this.ormProvider.getById(authUser.uid, AccountV1);
    if (baseUser) {
      return baseUser;
    } else {
      return this.createAccount(authUser.uid, authUser.email, null);
    }
  };

  getUserById = async (userId: ObjectId): Promise<AccountV1> => {
    const user = await this.ormProvider.getById(userId.id, AccountV1);
    // let org = await this.ormProvider.getBy(<ObjectId>(<unknown>user.currentWorkspace), Workspace);
    // user.currentWorkspace = org;
    return user;
  };

  getUserByEmail = async (email: string): Promise<AccountV1> => {
    const baseUser: any = await this.ormProvider.findSingle(
      collectionKeys.platformusers,
      'email',
      email,
    );
    const org = await this.ormProvider.getBy(
      <ObjectId>(<unknown>baseUser.currentWorkspace),
      WorkspaceV1,
    );
    baseUser.currentWorkspace = org;
    return baseUser;
  };

  setUserCurrentWorkspace = async (
    workspaceId: ObjectId,
    dbOps?: OrmOptions,
  ): Promise<void> => {
    const baseUser = await this.getAuthenticatedUser();
    baseUser.currentWorkspace = baseUser.workspaces.find(
      (workspace) => workspace.id === workspaceId.id,
    );

    await this.ormProvider.update(baseUser, dbOps);
  };

  setUserGoogleCredentials = async (
    userId: ObjectId,
    credential?: GoogleApiCredential,
    dbOps?: OrmOptions,
  ): Promise<AccountV1> => {
    const baseUser = await this.getUserById(userId);
    if (credential) baseUser.googleApiCredential = credential;
    else baseUser.googleApiCredential = null;

    await this.ormProvider.update(baseUser, dbOps);
    return baseUser;
  };

  setUserCurrentOrganisation = async (
    dbOps?: OrmOptions,
    organisationId?: ObjectId,
  ): Promise<void> => {
    const baseUser = await this.getAuthenticatedUser();
    baseUser.currentOrganisation = organisationId
      ? baseUser.organisations.find((organisation) =>
          organisation.equals(organisationId),
        )
      : undefined;
    await this.ormProvider.update(baseUser, dbOps);
  };

  setUserLocale = async (locale: string, dbOps?: OrmOptions): Promise<void> => {
    const baseUser = await this.getAuthenticatedUser();
    baseUser.locale = locale;
    await this.ormProvider.update(baseUser, dbOps);
  };

  updateUserName = async (name: string, dbOps?: OrmOptions): Promise<void> => {
    const baseUser = await this.getAuthenticatedUser();

    baseUser.id.labelShort = baseUser.email;
    baseUser.id.label = baseUser.email;
    baseUser.name = name;
    await this.ormProvider.update(baseUser, dbOps);
  };

  getUserLocale = async (): Promise<string> => {
    const baseUser = await this.getAuthenticatedUser();
    if (baseUser.locale) {
      return baseUser.locale;
    } else {
      await this.setUserLocale('en', null);
      return 'en';
    }
  };

  getUserCurrentWorkspace = async (): Promise<WorkspaceV1> => {
    const baseUser = await this.getAuthenticatedUser();

    if (baseUser && baseUser.currentWorkspace) {
      const currentWorkspace = await this.ormProvider.getBy(
        baseUser.currentWorkspace,
        WorkspaceV1,
      );

      return currentWorkspace;
    } else {
      return undefined;
    }
  };

  getUserCurrentOrganisation = async (): Promise<OrganisationV1> => {
    const baseUser = await this.getAuthenticatedUser();

    if (baseUser && baseUser.currentOrganisation) {
      const currentOrg = await this.ormProvider.getBy(
        baseUser.currentOrganisation,
        OrganisationV1,
      );
      return currentOrg;
    } else {
      return undefined;
    }
  };

  async removeUser(userId: ObjectId, dbOps: OrmOptions): Promise<void> {
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this.ormProvider.getTransaction();
      commitHere = true;
    }

    const user: AccountV1 = await this.ormProvider.getBy(userId, AccountV1);

    const [currentUserOrgs, workspacesPromise] = await Promise.all([
      user.organisations.map((o) => this.ormProvider.getBy(o, OrganisationV1)),
      user.workspaces.map((o) => this.ormProvider.getBy(o, WorkspaceV1)),
    ]);

    const orgs: OrganisationV1[] = await Promise.all(currentUserOrgs);
    const workspaces: WorkspaceV1[] = await Promise.all(workspacesPromise);

    for (const workspace of workspaces) {
      if (workspace.hasUser(userId)) {
        workspace.removeUser(userId);
        await this.ormProvider.update(workspace, dbOps);
      }
    }

    for (const organisation of orgs) {
      if (organisation.hasUser(userId)) {
        organisation.removeUser(userId);
        await this.ormProvider.update(organisation, dbOps);
      }
    }

    await this.ormProvider.delete(user.id, dbOps);

    await this.authProvider.removeUser(user.uid);

    if (commitHere) {
      await this.ormProvider.commit(dbOps.tx);
    }
  }
}
