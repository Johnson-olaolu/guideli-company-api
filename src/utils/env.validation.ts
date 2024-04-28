import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  // IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  // @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  PROJECT: string = 'GUIDELI';

  @IsString()
  @IsNotEmpty()
  VERSION: string;

  @IsString()
  @IsNotEmpty()
  BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  GUIDELI_AI_URL: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_URL: string;

  @IsString()
  @IsNotEmpty()
  SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  // @IsNumber()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  @IsString()
  @IsOptional()
  POSTGRES_CERT: string;

  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  S3_BUCKET = 'visa-documents-upload-bucket';

  @IsString()
  @IsNotEmpty()
  MAIL_FROM: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM_NAME: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_CLIENTID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  LINKEDIN_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  LINKEDIN_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  STRIPE_PUBLISHABLE_KEY: string;

  @IsString()
  @IsNotEmpty()
  STRIPE_LOCAL_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  STRIPE_API_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  MAIL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
