/* eslint-disable @typescript-eslint/no-unused-vars */
import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EnvironmentVariables } from 'src/utils/env.validation';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as sesClientModule from '@aws-sdk/client-ses';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail/mail.service';
import { AppNotificationGateway } from './app/app-notification.gateway';
import { AppNotificationService } from './app/app-notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppNotification } from './app/entity/app-notification.entity';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        const ses = new sesClientModule.SES({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('MAIL_USERNAME'),
            secretAccessKey: configService.get('MAIL_PASSWORD'),
          },
        });
        return {
          transport: {
            SES: { ses, aws: sesClientModule },
          },
          defaults: {
            from: `${configService.get('MAIL_FROM')}`,
          },
          template: {
            dir: join(__dirname, '../templates/mail'),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
          options: {
            partials: {
              dir: join(__dirname, '../templates/mail', 'partials'),
              options: {
                strict: true,
              },
            },
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([AppNotification]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    MailService,
    AppNotificationService,
    AppNotificationGateway,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
