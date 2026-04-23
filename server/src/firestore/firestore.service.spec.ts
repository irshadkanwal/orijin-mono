import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { FirestoreService } from './firestore.service';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../common/configs/config';

const chance = new Chance();

describe('Firestore', () => {
  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
      providers: [ConfigService, FirestoreService],
    }).compile();

    app.useLogger(new Logger());
    firestoreService = app.get<FirestoreService>(FirestoreService);
  });

  /**
   * WARN: Live firestore connection! From your .env!
   *
   * Keep as ".skip" in git!
   */
  describe.skip('Connect to firestore', () => {
    it('should return "Hello World!"', async () => {
      const result = await firestoreService.importFromFirestore('');

      expect(result).toEqual(2);
      // expect(await farmCollection.get()).toEqual({});
    });
  });
});
