import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsDefined()
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  folder: string;
}
