import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class QueryUserDto {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  companyId?: string;

  @IsBoolean()
  @IsOptional()
  acceptedInvite?: boolean;

  @IsString()
  @IsOptional()
  search: string;
}
