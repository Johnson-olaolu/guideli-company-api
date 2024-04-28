import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryClientDto {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  companyId: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  lawyerId: string;

  @IsString()
  @IsOptional()
  search: string;
}
