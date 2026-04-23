import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FirestoreService } from '../../firestore/firestore.service';

@Injectable()
export class FirebaseAuthAdminMiddleware implements NestMiddleware {
  logger = new Logger('FirebaseAuthAdminMiddleware');
  constructor(private readonly fireStoreService: FirestoreService) {}
  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      this.logger.warn('Token not found');
      return response.status(401).json({ message: 'Token not found' });
    }
    try {
      if (token) {
        const adminResponse = await this.fireStoreService.isAdminAndVerifyToken(
          token,
        );
        if (!adminResponse) {
          this.logger.warn('Invalid admin credentials');
          return response
            .status(401)
            .json({ message: 'Invalid admin credentials' });
        }
      }
      next();
    } catch (error) {
      if (
        !error.errorInfo?.message.startsWith('Firebase ID token has expired.')
      ) {
        this.logger.error(error.errorInfo);
      }
      this.logger.warn(error.errorInfo);
      return response
        .status(401)
        .json({ message: 'Firebase ID token has expired.' });
    }
  }
}
