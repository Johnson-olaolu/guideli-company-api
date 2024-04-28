import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteUsersDto {
  @IsEmail({}, { each: true })
  userEmails: string[];

  @IsString()
  @IsNotEmpty()
  companyId: string;
}
