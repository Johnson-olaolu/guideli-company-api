import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseDto } from './utils/Response.dto';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const httpsOptions = {
    key: readFileSync('./ssl/localhost.key'),
    cert: readFileSync('./ssl/localhost.crt'),
  };
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });
  app.setGlobalPrefix(`api`);

  const config = new DocumentBuilder()
    .setTitle('GUIDELI API')
    .setDescription('GUIDELI API Documentation')
    .setVersion('1.1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ResponseDto],
  });
  SwaggerModule.setup(`documentation`, app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(app.get(ConfigService).get('PORT') || 3000);
}
bootstrap();
