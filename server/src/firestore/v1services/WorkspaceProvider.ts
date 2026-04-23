import { ObjectId } from '../v1entities/utis/ObjectId';
import { createUniqueIdOfName, OrmOptions } from '../v1utils/utils';
import WorkspaceV1 from '../v1entities/org/WorkspaceV1';
import OrganisationV1 from '../v1entities/org/OrganisationV1';
import AccountV1 from '../v1entities/org/AccountV1';
import OrmProvider from './OrmProvider';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class WorkspaceProvider {
  private _ormProvider: OrmProvider;

  constructor(ormProvider: OrmProvider) {
    this._ormProvider = ormProvider;
  }

  async createWorkspace(
    name: string,
    configPrefix: string,
    organisationId: ObjectId,
    uniqueId: string,
    dbOps: OrmOptions,
  ): Promise<WorkspaceV1> {
    const organisation = await this._ormProvider.getBy(
      organisationId,
      OrganisationV1,
      dbOps,
    );

    const newWorkspace = new WorkspaceV1();
    newWorkspace.name = name;
    newWorkspace.organisation = organisationId;
    newWorkspace.configPrefix = configPrefix;

    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }
    if (uniqueId) {
      const dup = await this._ormProvider.getById(uniqueId, WorkspaceV1, dbOps);
      if (dup) {
        throw new Error('workspace with id already exists: ' + uniqueId);
      }
      newWorkspace.setCustomId(uniqueId);
    } else {
      const id = organisationId.id + '_' + createUniqueIdOfName(name);
      const dup = await this._ormProvider.getById(id, WorkspaceV1, dbOps);
      if (dup) {
        throw new Error('workspace with id already exists: ' + id);
      }
      newWorkspace.setCustomId(id);
    }

    const newWorkspaceResponse: WorkspaceV1 = await this._ormProvider.create(
      newWorkspace,
      dbOps,
    );

    await Promise.all(
      organisation.admins.map((admin) => {
        return this.addWorkspaceUser(newWorkspaceResponse.id, admin, dbOps);
      }),
    );

    organisation.addWorkspace(newWorkspaceResponse.id);
    await this._ormProvider.update(organisation, dbOps);

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }

    return newWorkspaceResponse;
  }

  getWorkspace = async (workspaceId: ObjectId): Promise<WorkspaceV1> => {
    return this._ormProvider.getBy(workspaceId, WorkspaceV1);
  };

  getWorkspaceConfigPrefix = async (workspaceId: ObjectId): Promise<string> => {
    const workspace = await this.getWorkspace(workspaceId);
    return workspace.configPrefix;
  };

  async updateUserWithRole(
    roleParams: {
      workspace: WorkspaceV1;
      role: string;
      name: string;
      user: AccountV1;
    },
    dbOps: OrmOptions,
  ) {
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }

    console.log('updateUserWithRole role', roleParams);
    roleParams.user.setWorkspaceRole(roleParams.workspace.id, roleParams.role);

    await this._ormProvider.update(roleParams.user, dbOps);

    console.log('updateUserWithRol, update user', roleParams);
    const baseUser = await this._ormProvider.getBy(
      roleParams.user.id,
      AccountV1,
      dbOps,
    );

    baseUser.id.labelShort = baseUser.email;
    baseUser.id.label = baseUser.email;
    baseUser.name = roleParams.name;
    await this._ormProvider.update(baseUser, dbOps);

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
  }

  async addWorkspaceUserRole(
    roleParams: {
      workspace: WorkspaceV1;
      role: string;
      name: string;
      user: AccountV1;
    },
    dbOps: OrmOptions,
  ) {
    console.log('adding role ', roleParams);
    roleParams.user.setWorkspaceRole(roleParams.workspace.id, roleParams.role);
    await this._ormProvider.update(roleParams.user, dbOps);
  }

  async addWorkspaceUser(
    workspaceId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<void> {
    const user: AccountV1 = await this._ormProvider.getBy(
      userId,
      AccountV1,
      dbOps,
    );
    const workspace: WorkspaceV1 = await this._ormProvider.getBy(
      workspaceId,
      WorkspaceV1,
      dbOps,
    );
    console.log('addWorkspaceUser');
    let commitHere = false;
    if (!dbOps?.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }
    if (!workspace.hasUser(user.id)) {
      console.log(
        `Workspace not added, adding ${workspaceId.id} ${userId.labelShort}`,
      );
      workspace.addUser(user.id);
      await this._ormProvider.update(workspace, dbOps);
    }

    if (!user.hasWorkSpace(workspace.id)) {
      console.log(
        `Adding workspace to user ${workspaceId.id} ${userId.labelShort}`,
      );
      user.addWorkspace(workspace.id);
      await this._ormProvider.update(user, dbOps);
    }

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
  }

  async removeWorkspaceUser(
    workspaceId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<void> {
    try {
      console.log(workspaceId, userId);
      const workspaceObject: WorkspaceV1 = await this.getWorkspace(workspaceId);
      const userObject: AccountV1 = await this._ormProvider.getBy(
        userId,
        AccountV1,
        dbOps,
      );
      let commitHere = false;
      if (!dbOps.tx) {
        dbOps.tx = this._ormProvider.getTransaction();
        commitHere = true;
      }
      if (userObject) {
        userObject.removeWorkspace(workspaceObject.id);
        await this._ormProvider.update(userObject, dbOps);
      } else {
        console.warn(
          `Something is wrong, user object can't be found with ${JSON.stringify(
            userId,
          )}`,
        );
      }
      if (workspaceObject && userObject) {
        workspaceObject.removeUser(userObject.id);
        await this._ormProvider.update(workspaceObject, dbOps);
      } else {
        console.warn(
          `Something is wrong, workspaceObject can't be found with ${JSON.stringify(
            workspaceId,
          )}`,
        );
      }

      if (commitHere) {
        await this._ormProvider.commit(dbOps.tx);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeWorkspace(
    workspaceId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<void> {
    const workspace: WorkspaceV1 = await this.getWorkspace(workspaceId);
    const organisation: OrganisationV1 = await this._ormProvider.getBy(
      workspace.organisation,
      OrganisationV1,
      dbOps,
    );
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }
    for (const userId of workspace.users) {
      await this.removeWorkspaceUser(workspace.id, userId, dbOps);
    }

    organisation.removeWorkspace(workspace.id);

    await this._ormProvider.update(organisation, dbOps);
    await this._ormProvider.delete(workspaceId, dbOps);

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
  }
}
