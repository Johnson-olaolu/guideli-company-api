import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validation';
import { DatabaseModule } from './database/database.module';
import { CompanyModule } from './company/company.module';
import { PaymentModule } from './payment/payment.module';
import { ClientModule } from './client/client.module';
import { FileModule } from './file/file.module';
import { ApplicationModule } from './application/application.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    NotificationModule,
    SeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    ClientModule,
    CompanyModule,
    ApplicationModule,
    FileModule,
    PaymentModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
