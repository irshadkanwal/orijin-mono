import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FirestoreService } from '../../firestore/firestore.service';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  logger = new Logger('FirebaseAuthMiddleware');
  constructor(private readonly firestoreService: FirestoreService) {}
  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers.authorization?.split(' ')[1];
    // Temporary disable requirement for v1
    // if (!token) {
    //   throw new UnauthorizedException('Token not found');
    // }
    try {
      if (token) {
        await this.firestoreService.verifyTokenAndOrganisations(token);
        if (request['locals']) {
          // Not available in Login page for example
          request['locals'].token = token; // Make token available for Controllers via @Req annotation
        }
      }
      next();
    } catch (error) {
      if (
        !error.errorInfo?.message.startsWith('Firebase ID token has expired.')
      ) {
        this.logger.error(error.errorInfo ?? error);
      }
      this.logger.warn(error.errorInfo ?? error);
      // Temporary
      next();
      // throw new UnauthorizedException('Invalid token');
    }
  }
}
