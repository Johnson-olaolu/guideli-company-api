import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateClientDefaultProfileDto {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  profileId: string;
}
