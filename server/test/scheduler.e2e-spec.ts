import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingModuleWithPrisma } from './test-util';
import { ExternalSchedulerModule } from '../src/externalScheduler/externalScheduler.module';

describe('Scheduler Controller (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [ExternalSchedulerModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
  });

  it('/scheduler/ (POST)', () => {
    return request(server)
      .post(`/scheduler/`)
      .send({ type: 'Testing' })
      .expect(201);
  });
});
