import { GraphQLModule } from '@nestjs/graphql';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loggingMiddleware, PrismaModule, PrismaService } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import config from './common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';
import { SupportServiceModule } from './supportServices/supportService.module';
import { CropsModule } from './crops/crops.module';
import { GeodatasModule } from './geodatas/geodatas.module';
import { PersonsModule } from './persons/persons.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { TagsModule } from './tags/tags.module';
import { AppLoggerMiddleware } from './common/middleware/AppLoggerMiddleware';
import { FirestoreModule } from './firestore/firestore.module';
import { CertificationsModule } from './certifications/certifications.module';
import { LocationsModule } from './locations/locations.module';
import { FarmsModule } from './farms/farms.module';
import { FirebaseAuthMiddleware } from './common/middleware/FirebaseAuthMiddleware';
import { FirebaseAuthAdminMiddleware } from './common/middleware/FirebaseAuthAdminMiddleware';
import { PolygonUtilModule } from './polygonUtil/polygonUtil.module';
import { SendGridService } from './common/service/send-grid/send-grid.service';
import { FiltersModule } from './filters/filters.module';
import { ScoringModule } from './scoring/scoring.module';
import { RuleModule } from './rule/rule.module';
import { ExternalSchedulerModule } from './externalScheduler/externalScheduler.module';
import {
  EXTERNAL_SCHEDULER_URL,
  FARM_INSPECTION_URL,
} from './common/constants';
import { GoogleCloudAuthMiddleware } from './common/middleware/GoogleCloudAuthMiddleware';
import { GeocledianModule } from './geocledian/geocledian.module';
import { ChangesModule } from './changes/changes.module';
import { DataImportsModule } from './dataImports/dataImports.module';
import { LotsModule } from './lot/lots.module';
import { PaymentTransactionsModule } from './paymentTransaction/paymentTransaction.module';
import { VesselsModule } from './vessels/vessels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ====
      // WARN about "envFilePath": as Prisma's CLI commands depend on the .env file, it's better to use the Dotenv CLI to change files from outside
      // rather than rely on changing inside NestJS. See package.json "test:e2e:local" for reference
      // ====
      isGlobal: true,
      load: [config],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          // loggingMiddleware({
          //   logger: new Logger('PrismaMiddleware'),
          //   logLevel: 'log',
          // }),
        ],
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    PostsModule,
    SupportServiceModule,
    FiltersModule,
    GeodatasModule,
    OrganisationsModule,
    TagsModule,
    CertificationsModule,
    LocationsModule,
    FarmsModule,
    PersonsModule,
    LotsModule,
    PaymentTransactionsModule,
    FacilitiesModule,
    ChangesModule,
    CropsModule,
    VesselsModule,
    FirestoreModule,
    PolygonUtilModule,
    ScoringModule,
    RuleModule,
    ExternalSchedulerModule,
    GeocledianModule,
    DataImportsModule
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, PrismaService, SendGridService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  // TODO: Rewrite these as Guards and apply in Controllers, rather than doing out of sight here
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
    consumer
      .apply(FirebaseAuthMiddleware)
      .exclude(EXTERNAL_SCHEDULER_URL, FARM_INSPECTION_URL)
      .forRoutes('*');
    consumer
      .apply(GoogleCloudAuthMiddleware) //
      .forRoutes(EXTERNAL_SCHEDULER_URL);
    consumer
      .apply(FirebaseAuthAdminMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.ALL },
        { path: 'user', method: RequestMethod.ALL },
        { path: 'reset-password', method: RequestMethod.POST },
      );
  }
}
