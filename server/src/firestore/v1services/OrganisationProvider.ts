import UserProvider from './UserProvider';

import WorkspaceProvider from './WorkspaceProvider';
import { OrmOptions } from '../v1utils/utils';
import OrganisationV1 from '../v1entities/org/OrganisationV1';
import AccountV1 from '../v1entities/org/AccountV1';
import { ObjectId } from '../v1entities/utis/ObjectId';
import WorkspaceV1 from '../v1entities/org/WorkspaceV1';
import { Injectable } from '@nestjs/common';
import OrmProvider from './OrmProvider';

@Injectable()
export default class OrganisationProvider {
  private _ormProvider: OrmProvider;
  private _userProvider: UserProvider;
  private workspaceProvider: WorkspaceProvider;

  constructor(
    ormProvider: OrmProvider,
    userProvider: UserProvider,
    workspaceProvider: WorkspaceProvider,
  ) {
    this._ormProvider = ormProvider;
    this._userProvider = userProvider;
    this.workspaceProvider = workspaceProvider;
  }

  async createOrganisation(
    name: string,
    uniqueId?: string,
    dbOps?: OrmOptions,
  ): Promise<OrganisationV1> {
    const newOrganisation = new OrganisationV1();
    if (uniqueId) {
      const existingOrganisation = await this._ormProvider.getById(
        uniqueId,
        OrganisationV1,
      );
      if (existingOrganisation) {
        throw new Error(
          'An organisation already exists with above id. Please choose another.',
        );
      }
      newOrganisation.setCustomId(uniqueId);
    }
    newOrganisation.name = name;
    return this._ormProvider.create(newOrganisation, dbOps);
  }

  getOrganisation = async (
    organisationId: ObjectId,
  ): Promise<OrganisationV1> => {
    return this._ormProvider.getBy(organisationId, OrganisationV1);
  };

  updatedOrganisation = async (organisation: OrganisationV1) => {
    return this._ormProvider.update(organisation);
  };

  async addOrganisationUser(
    organisationId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<AccountV1> {
    console.log(`Add org start ${organisationId.id} ${userId.email}`);
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }
    const user = await this._ormProvider.getBy(userId, AccountV1, dbOps);
    const organisation = await this.getOrganisation(organisationId);
    console.log('Add org to user new');

    if (!user.hasOrganisation(organisation.id)) {
      console.log(
        `Org not added, adding ${organisationId.id} ${userId.labelShort}`,
      );
      user.addOrganisation(organisation.id);
      await this._ormProvider.update(user, dbOps);
    }

    if (!organisation.hasUser(user.id)) {
      console.log(
        `Adding user to org ${organisationId.id} ${userId.labelShort}`,
      );
      organisation.addUser(user.id);
      await this._ormProvider.update(organisation, dbOps);
    }

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
    return user;
  }

  async removeOrganisationUser(
    organisationId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<void> {
    const user: AccountV1 = await this._ormProvider.getBy(userId, AccountV1);

    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }

    const organisation: OrganisationV1 = await this.getOrganisation(
      organisationId,
    );
    if (organisation.hasAdmin(userId)) {
      await this.removeOrganisationAdmin(organisationId, userId, dbOps);
    }

    if (user.hasOrganisation(organisationId)) {
      user.removeOrganisation(organisation.id);
      if (user.currentWorkspace) {
        if (
          organisation.workspaces.find((workspace) =>
            workspace.equals(user.currentWorkspace),
          )
        ) {
          user.currentWorkspace = null;
        }
      }
      await this._ormProvider.update(user, dbOps);
    }

    const workspaces: WorkspaceV1[] = await Promise.all(
      user.workspaces.map((o) => this._ormProvider.getBy(o, WorkspaceV1)),
    );

    for (const workspace of workspaces) {
      if (workspace && workspace.organisation.equals(organisationId)) {
        this.workspaceProvider.removeWorkspaceUser(
          workspace.id,
          user.id,
          dbOps,
        );
      }
    }
    if (organisation.hasUser(userId)) {
      organisation.removeUser(userId);
      await this._ormProvider.update(organisation, dbOps);
    }

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
  }

  async removeOrganisation(
    organisationId: ObjectId,
    dbOps?: OrmOptions,
  ): Promise<void> {
    const organisation = await this.getOrganisation(organisationId);

    if (organisation) {
      await this._ormProvider.delete(organisation.id, dbOps);
    }
  }

  async addOrganisationAdmin(
    organisationId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<void> {
    const organisation = await this.getOrganisation(organisationId);

    const user = await this._ormProvider.getById(userId.id, AccountV1, dbOps);

    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }

    if (!organisation.hasAdmin(user.id)) {
      organisation.addAdmin(user.id);
      await this._ormProvider.update(organisation, dbOps);
    }

    for (const workspace of organisation.workspaces) {
      await this.workspaceProvider.addWorkspaceUser(workspace, user.id, dbOps);
    }

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
  }

  async removeOrganisationAdmin(
    organisationId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
  ): Promise<void> {
    const organisation = await this.getOrganisation(organisationId);
    const user = await this._userProvider.getUserById(userId);
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this._ormProvider.getTransaction();
      commitHere = true;
    }

    if (organisation.hasAdmin(user.id)) {
      organisation.removeAdmin(user.id);
      await this._ormProvider.update(organisation, dbOps);
    }

    if (commitHere) {
      await this._ormProvider.commit(dbOps.tx);
    }
  }


}
