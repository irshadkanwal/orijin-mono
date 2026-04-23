import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ISignupParams, IUserInfo } from './v1entities/utis/types';
import { Request } from 'express';
import { FirestoreService } from './firestore.service';

@Injectable()
export class FirebaseAuthService {
  private logger = new Logger(FirebaseAuthService.name);
  constructor(private readonly firestoreService: FirestoreService) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (serviceAccount.projectId) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
    } else {
      this.logger.warn('FIREBASE_PROJECT_ID missing, firestore disabled!');
    }
  }

  async removeUser(id: string) {
    let firebaseUser = null;
    try {
      await admin.auth().deleteUser(id);
    } catch (userFetchError) {
      console.log('resetPassowrd ERROR', userFetchError);
    }
    return firebaseUser;
  }

  async changePassword(email: string, password: string) {
    let firebaseUser = null;
    try {
      firebaseUser = await admin.auth().getUserByEmail(email);

      await admin.auth().updateUser(firebaseUser.uid, {
        ...firebaseUser,
        password,
      });
    } catch (userFetchError) {
      console.log('changePassword ERROR', userFetchError);
    }
    return firebaseUser;
  }
  async registerAccount(email: string, password: string) {
    const user = await admin.auth().createUser({
      email,
      password,
    });
    return user;
  }

  signup = async (signupParams: ISignupParams) => {
    const user = await admin.auth().createUser({
      email: signupParams.email,
      password: signupParams.password,
      displayName: signupParams.displayName,
    });

    const userInfo: IUserInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerId: 'api',
    };

    return userInfo;
  };

  getUserByEmail = async (email: string) => {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return {
        displayName: userRecord.displayName,
        email: userRecord.email,
        phoneNumber: userRecord.phoneNumber,
        photoURL: userRecord.photoURL,
        providerId: userRecord.providerData.find(
          (p) => p.providerId === 'password',
        )?.providerId,
        uid: userRecord.uid,
      };
    } catch (error) {
      console.log('Error fetching user data:', error);
      return null;
    }
  };

  async verifyAccount(idToken: string) {
    return await admin.auth().verifyIdToken(idToken);
  }

  async sendPasswordResetEmail(email: string): Promise<string> {
    return await admin.auth().generatePasswordResetLink(email);
  }

  async fetchUserDetailsAndIsAdmin(req: Request) {
    const token = this.extractToken(req);
    const [userDetails, isAdmin] = await Promise.all([
      this.verifyAccount(token),
      this.firestoreService.isAdminAndVerifyToken(token),
    ]);

    return { userDetails, isAdmin };
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new HttpException(
        'Authorization header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(
        'Token missing from authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return token;
  }
}
