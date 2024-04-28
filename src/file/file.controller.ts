import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { File } from './entities/file.entity';
import { ResponseDto } from 'src/utils/Response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiExtraModels(File)
@ApiBearerAuth()
@ApiTags('File')
@UseGuards(AuthGuard('jwt'))
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiResponse({
    status: 200,
    description: 'User details fetched updated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(File),
            },
          },
        },
      ],
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1e7 }),
          // new FileTypeValidator({ fileType: 'image/*' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @Req() request: Request,
    @Body('folder') folder: string,
  ) {
    const user = (request as any)?.user as User;
    const data = await this.fileService.uploadFile(
      {
        file,
        folder: folder,
      },
      user,
    );
    return {
      success: true,
      message: 'File Upload Successfull',
      data,
    };
  }

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string) {
    const data = await this.fileService.findOne(fileId);
    return {
      success: true,
      message: 'File fetched successfully',
      data,
    };
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    await this.fileService.deleteFile(fileId);
    return {
      success: true,
      message: 'File fetched successfully',
    };
  }
}
