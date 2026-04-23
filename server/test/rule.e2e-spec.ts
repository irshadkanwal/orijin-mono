import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RuleModule } from '../src/rule/rule.module';
import { createTestingModuleWithPrisma } from './test-util';
import { CreateRuleDto } from 'src/rule/dto/rule.dto';
import { PrismaService } from 'nestjs-prisma';

describe('Rules E2E', () => {
  let app: INestApplication;
  let server: HttpServer;
  let prisma: PrismaService;
  let ruleValues: CreateRuleDto = {
    name: 'some rule',
    functionCode: '',
    functionType: 'FARM_AREA_VALIDATOR',
    category: 'TEST',
    commonThreshold: 20,
  };
  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [RuleModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
    prisma = initialized.moduleFixture.get<PrismaService>(PrismaService);
  });
  describe('Create', () => {
    it('Create a test rule', async () => {
      return request(server).post('/rules').send(ruleValues).expect(201);
    });
  });

  describe('Get', () => {
    beforeEach(async () => {
      await prisma.rule.create({
        data: ruleValues,
      });
    });

    it('Get rules', async () => {
      const results = await request(server).get('/rules').expect(200);
      expect(results.body).toEqual(expect.any(Array));
      expect(results.body).toHaveLength(1);
      expect(results.body[0].category).toBe('TEST');
    });
  });
});
