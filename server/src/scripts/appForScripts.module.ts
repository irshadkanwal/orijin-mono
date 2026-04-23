import { Logger, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';
import config from '../common/configs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { SupportServiceModule } from '../supportServices/supportService.module';
import { GeodatasModule } from '../geodatas/geodatas.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { TagsModule } from '../tags/tags.module';
import { CertificationsModule } from '../certifications/certifications.module';
import { LocationsModule } from '../locations/locations.module';
import { FarmsModule } from '../farms/farms.module';
import { PersonsModule } from '../persons/persons.module';
import { FacilitiesModule } from '../facilities/facilities.module';
import { CropsModule } from '../crops/crops.module';
import { FirestoreModule } from '../firestore/firestore.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AppResolver } from '../app.resolver';
import { GeocledianModule } from '../geocledian/geocledian.module';
import { DataImportsModule } from '../dataImports/dataImports.module';
import { PolygonUtilModule } from '../polygonUtil/polygonUtil.module';
import { LotsModule } from '../lot/lots.module';
import { PaymentTransactionsModule } from '../paymentTransaction/paymentTransaction.module';
import { VesselsModule } from '../vessels/vessels.module';

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
          //   logLevel: 'debug',
          // }),
        ],
      },
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    SupportServiceModule,
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
    CropsModule,
    VesselsModule,
    FirestoreModule,
    GeocledianModule,
    DataImportsModule,
    PolygonUtilModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModuleForScripts {}
