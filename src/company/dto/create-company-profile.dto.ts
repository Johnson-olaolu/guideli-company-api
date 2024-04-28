import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Location } from 'src/utils/constants';

export class CreateCompanyProfileDto {
  @IsUrl()
  website: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  contactPhoneNo: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Location)
  country: Location;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Location)
  state: Location;

  @IsString()
  @IsNotEmpty()
  zipCode: string;
}
