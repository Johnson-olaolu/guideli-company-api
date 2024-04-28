import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { EnvironmentVariables } from 'src/utils/env.validation';

@Injectable()
export class AwsFileService {
  logger = new Logger(AwsFileService.name);
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  private s3Client = new S3Client({
    region: this.configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async uploadFile(file: Express.Multer.File, folder: string, userId: string) {
    try {
      const key = `file/${userId}/${folder}/${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
      });

      await this.s3Client.send(command);
      this.logger.log(`${file.originalname} uploaded to ${folder}`);

      return {
        url: `https://${this.configService.get('S3_BUCKET')}.s3.amazonaws.com/file/${userId}/${folder}/${file.originalname}`,
        s3Uri: `s3://${this.configService.get('S3_BUCKET')}/${key}`,
      };
    } catch (error) {
      throw new InternalServerErrorException('File Could Not be uploaded');
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: key,
      });
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('File Could Not be deleted');
    }
  }
}
