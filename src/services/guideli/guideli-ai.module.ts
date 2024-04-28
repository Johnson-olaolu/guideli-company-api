import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/utils/env.validation';
import { GuideliAIService } from './guideli-ai.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        timeout: 1000000,
        maxRedirects: 5,
        baseURL: configService.get('GUIDELI_AI_URL'),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GuideliAIService],
  controllers: [],
  exports: [GuideliAIService],
})
export class GuideliAIModule {}
