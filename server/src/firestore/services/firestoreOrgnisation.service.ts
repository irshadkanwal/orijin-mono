import { Injectable } from '@nestjs/common';
import Organisation from '../entities/org/Organisation';
import { FirestoreOrmService } from './firestoreOrm.service';
import { OrmOptions } from '../entities/utils/utils';
import { ObjectId } from '../entities/utils/ObjectId';
import Account from '../entities/org/Accounts';

@Injectable()
export class FirestoreOrgnisationService {
  private firestoreOrmService: FirestoreOrmService;

  constructor(firestoreOrmService: FirestoreOrmService) {
    this.firestoreOrmService = firestoreOrmService;
  }

  async getOne(id: string): Promise<any> {
    return {} as any;
  }

  async createOrganisation(
    name: string,
    uniqueId?: string,
    dbOps?: OrmOptions,
  ) {
    const newOrganisation = new Organisation();
    if (uniqueId) {
      const existingOrganisation = await this.firestoreOrmService.getById(
        uniqueId,
        Organisation,
      );
      if (existingOrganisation) {
        throw new Error(
          'An organisation already exists with above id. Please choose another.',
        );
      }
      newOrganisation.setCustomId(uniqueId);
    }
    newOrganisation.name = name;

    newOrganisation.addAdmin(dbOps.currentUser);
    return this.firestoreOrmService.create(newOrganisation, dbOps);
  }

  updateOrganisation = async (
    organisation: Organisation,
    dbOps?: OrmOptions,
  ) => {
    return await this.firestoreOrmService.update(organisation, dbOps);
  };

  async addOrganisationUser(
    organisationId: ObjectId,
    userId: ObjectId,
    dbOps: OrmOptions,
    userObj?: Account,
  ): Promise<Account> {
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this.firestoreOrmService.getTransaction();
      commitHere = true;
    }

    const user =
      userObj ?? (await this.firestoreOrmService.getBy(userId, Account, dbOps));
    console.log('user: ', user);
    if (!user) {
      throw new Error('User not found');
    }

    const organisation = await this.getOrganisation(organisationId);

    if (!organisation) {
      throw new Error('Organisation not found');
    }

    if (!user.hasOrganisation(organisation.id)) {
      console.log(
        `Org not added, adding ${organisationId.id} ${userId.labelShort}`,
      );
      user.addOrganisation(organisation.id);
      await this.firestoreOrmService.update(user, dbOps);
    }

    if (!organisation.hasUser(user.id)) {
      console.log(
        `Adding user to org ${organisationId.id} ${userId.labelShort}`,
      );
      organisation.addUser(user.id);
      await this.firestoreOrmService.update(organisation, dbOps);
    }

    if (commitHere) {
      await this.firestoreOrmService.commit(dbOps.tx);
    }
    return user;
  }

  getOrganisation = async (organisationId: ObjectId): Promise<Organisation> => {
    return this.firestoreOrmService.getBy(organisationId, Organisation);
  };
}
