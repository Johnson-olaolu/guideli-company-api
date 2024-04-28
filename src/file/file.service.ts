import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/utils/env.validation';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { AwsFileService } from 'src/services/aws/aws-file.service';
import * as bytes from 'bytes';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private awsFileService: AwsFileService,
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async findOne(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found for this ID');
    }
    return file;
  }

  async uploadFile(createFileDto: CreateFileDto, user: User) {
    const res = await this.awsFileService.uploadFile(
      createFileDto.file,
      createFileDto.folder,
      user.id,
    );
    const existingFile = await this.fileRepository.findOne({
      where: { url: res.url },
    });
    if (existingFile) {
      return existingFile;
    } else {
      const file = await this.fileRepository.save({
        user: user,
        url: res.url,
        s3URI: res.s3Uri,
        name: createFileDto.file.originalname,
        folder: createFileDto.folder,
        content_type: createFileDto.file.mimetype,
        size: bytes(createFileDto.file.size),
      });
      return file;
    }
  }

  async deleteFile(fileId: string) {
    const file = await this.findOne(fileId);
    await this.awsFileService.deleteFile(file.url);
    await this.fileRepository.delete(file.id);
  }
}
