import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FirestoreService } from '../../firestore/firestore.service';
import { OAuth2Client } from 'google-auth-library';

//
// // Example usage in an Express.js route handler
// app.post('/scheduled-task', async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send('No authorization header');
//   }
//
//   const token = authHeader.split('Bearer ')[1];
//   if (!token) {
//     return res.status(401).send('Invalid authorization header format');
//   }
//
//   try {
//     const audience = 'https://your-cloud-run-service-url';
//     const payload = await verifyCloudSchedulerToken(token, audience);
//
//     // Token is valid, proceed with your scheduled task
//     // ... your task logic here ...
//
//     res.status(200).send('Task completed successfully');
//   } catch (error) {
//     res.status(401).send('Unauthorized: ' + error.message);
//   }
// });

@Injectable()
export class GoogleCloudAuthMiddleware implements NestMiddleware {
  logger = new Logger(GoogleCloudAuthMiddleware.name);
  client: OAuth2Client;

  constructor(private readonly firestoreService: FirestoreService) {
    this.client = new OAuth2Client();
  }

  async verifyCloudSchedulerToken(token, audience) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        // audience: audience, // Should be your Cloud Run service URL
      });

      const payload = ticket.getPayload();
      this.logger.log(JSON.stringify(payload, null, 4));

      // Verify the token was issued for your service account
      // if (
      //   payload['email'] !==
      //   'your-service-account@your-project.iam.gserviceaccount.com'
      // ) {
      //   throw new Error('Token not issued for the expected service account');
      // }

      // Verify the token hasn't expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        throw new Error('Token has expired');
      }

      // If we get here, the token is valid
      this.logger.log('Token verified successfully');
      return payload;
    } catch (error) {
      this.logger.error('Token verification failed:', error.message);
      throw error;
    }
  }

  async use(request: Request, response: Response, next: NextFunction) {
    this.logger.log(request.headers.authorization);
    try {
      const token = request.headers.authorization?.split(' ')[1];
      const audience = 'https://your-cloud-run-service-url';
      await this.verifyCloudSchedulerToken(token, audience);
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
