import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;
}
