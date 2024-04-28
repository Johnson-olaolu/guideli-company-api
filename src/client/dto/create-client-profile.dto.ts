import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClientProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  cvId: string;
}
