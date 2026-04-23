import { Injectable } from '@nestjs/common';
import { OrmOptions } from '../entities/utils/utils';
import Account from '../entities/org/Accounts';
import { FirestoreOrmService } from './firestoreOrm.service';
import { ObjectId } from '../entities/utils/ObjectId';
import { collectionKeys } from '../entities/utils/DbMappingUtils';
import Workspace from '../entities/org/Workspace';
import Organisation from '../entities/org/Organisation';
import { FirebaseAuthService } from '../firebaseAuth.service';

@Injectable()
export class FirestoreUserService {
  private firestoreOrmService: FirestoreOrmService;
  private firestoreAuthService: FirebaseAuthService;

  constructor(
    firestoreOrmService: FirestoreOrmService,
    firebaseAuthService: FirebaseAuthService,
  ) {
    this.firestoreAuthService = firebaseAuthService;
    this.firestoreOrmService = firestoreOrmService;
  }

  isSuperUser = async (userId: ObjectId) => {
    const user = await this.getUserById(userId);
    const superUserObject = await this.firestoreOrmService.all('superusers');

    if (
      superUserObject.length > 0 &&
      superUserObject.some((su) => su.email === user.email)
    ) {
      return true;
    } else {
      return false;
    }
  };

  getUserById = async (userId: ObjectId): Promise<Account> => {
    const user = await this.firestoreOrmService.getById(userId.id, Account);
    return user;
  };

  getUserByEmail = async (email: string): Promise<Account> => {
    const baseUser: any = await this.firestoreOrmService.findSingle(
      collectionKeys.platformusers,
      'email',
      email,
    );
    const org = await this.firestoreOrmService.getBy(
      <ObjectId>(<unknown>baseUser.currentWorkspace),
      Workspace,
    );
    baseUser.currentWorkspace = org;
    return baseUser;
  };

  createAccount = async (
    uid: string,
    email: string,
    dbOps: OrmOptions,
  ): Promise<Account> => {
    const newUser = new Account();
    newUser.setCustomId(uid);
    if (email) {
      newUser.email = email;
    }
    const baseUserPromise = await this.firestoreOrmService.create(
      newUser,
      dbOps,
    );

    if (email) {
      baseUserPromise.id.labelShort = email;
      baseUserPromise.id.label = email;
      await this.firestoreOrmService.update(newUser, dbOps);
    }

    return baseUserPromise;
  };

  updateUser = async (user: Account, dbOps?: OrmOptions) => {
    return await this.firestoreOrmService.update(user, dbOps);
  };

  updateUserName = async (
    id: string,
    name: string,
    dbOps?: OrmOptions,
  ): Promise<void> => {
    const baseUser = await this.firestoreOrmService.getById(id, Account);

    baseUser.id.labelShort = baseUser.email;
    baseUser.id.label = baseUser.email;
    baseUser.name = name;
    await this.firestoreOrmService.update(baseUser, dbOps);
  };

  async removeUser(userId: string, dbOps: OrmOptions): Promise<void> {
    let commitHere = false;
    if (!dbOps.tx) {
      dbOps.tx = this.firestoreOrmService.getTransaction();
      commitHere = true;
    }

    const user: Account = await this.firestoreOrmService.getById(
      userId,
      Account,
      dbOps,
    );

    const [currentUserOrgs, workspacesPromise] = await Promise.all([
      user.organisations.map((o) =>
        this.firestoreOrmService.getBy(o, Organisation),
      ),
      user.workspaces.map((o) => this.firestoreOrmService.getBy(o, Workspace)),
    ]);

    const orgs: Organisation[] = await Promise.all(currentUserOrgs);
    const workspaces: Workspace[] = await Promise.all(workspacesPromise);

    for (const workspace of workspaces) {
      if (workspace.hasUser(user.id)) {
        workspace.removeUser(user.id);
        await this.firestoreOrmService.update(workspace, dbOps);
      }
    }

    for (const organisation of orgs) {
      if (organisation.hasUser(user.id)) {
        organisation.removeUser(user.id);
        await this.firestoreOrmService.update(organisation, dbOps);
      }
    }

    await this.firestoreOrmService.delete(user.id, dbOps);

    await this.firestoreAuthService.removeUser(user.uid);

    if (commitHere) {
      await this.firestoreOrmService.commit(dbOps.tx);
    }
  }
}
