import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateRoleDto } from 'src/user/role/dto/create-role.dto';

export const POSTGRES_ERROR_CODES = {
  unique_violation: 23505,
};

export const defaultRoles: CreateRoleDto[] = [
  { name: 'super_admin', description: 'Site Super Admin' },
  { name: 'admin', description: 'Company Admin' },
  { name: 'user', description: 'Normal user' },
  { name: 'editor', description: 'Company Editor' },
  { name: 'reviewer', description: 'Company Reviewer' },
  { name: 'viewer', description: 'Extetnal Viewer' },
];

interface IDefaultSuperAdmin extends CreateUserDto {
  isEmailVerified: boolean;
  role: string;
}

export const defaultSuperAdmin: IDefaultSuperAdmin = {
  email: 'super-admin@guideli.com',
  password: 'Admin_123',
  isEmailVerified: true,
  role: 'super_admin',
  firstName: 'Super',
  lastName: 'Admin',
};

export class Location {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  // @IsNotEmpty()
  // @IsString()
  // iso3: string;
  // @IsNotEmpty()
  // @IsString()
  // flag: string;
}

export enum ResidentialBusinessEnum {
  RESIDENTIAL = ' RESIDENTIAL',
  BUSINESS = 'BUSINESS',
}

export enum VisaApplicationTypesEnum {
  EB1 = 'EB1',
  EB2 = 'EB2',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatusEnum {
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  SEPERATED = 'SEPERATED',
  NEVER_MARRIED = 'NEVER_MARRIED',
  WIDOWED = 'WIDOWED',
}

export enum JobTypeEnum {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum RegistrationTypeEnum {
  EMAIL = 'EMAIL',
  LINKEDIN = 'LINKEDIN',
  GOOGLE = 'GOOGLE',
}

export enum ExtraInfoTypeEnum {
  PROJECT = 'PROJECT',
  AWARD_AND_RECOGNITION = 'AWARD_AND_RECOGNITION',
  PROFESSIONAL_CONTRIBUTION = 'PROFESSIONAL_CONTRIBUTION',
  LICENSE = 'LICENSE',
  CERTIFICATION = 'CERTIFICATION',
  EXTRAORDINARY_ACHIEVEMENT = 'EXTRAORDINARY_ACHIEVEMENT',
  ASSOCIATION = 'ASSOCIATION',
}

export type notificationType =
  | 'petition-generated'
  | 'recommendation-generated'
  | 'payment-confirmed';

export enum AppNotificationEnum {
  CREATED = 'CREATED',
  SEEN = 'SEEN',
}
