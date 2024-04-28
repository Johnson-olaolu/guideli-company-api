import { IsNumber } from 'class-validator';

export class UpdateCompanyOnboardingDto {
  @IsNumber()
  stage: number;
}
