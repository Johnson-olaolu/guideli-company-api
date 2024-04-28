import { Injectable } from '@nestjs/common';
import {
  CreatePetitionLetterDto,
  CreatePetitionResponseDto,
  GenerateAllResponseDto,
  GenerateEndeavoursDto,
  GenerateEndeavoursResponseDto,
  GenerateResponseDto,
} from './dto/guideli-ai.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EducationHistory } from 'src/client/entities/education-history.entity';
import { EmploymentHistory } from 'src/client/entities/employment-history.entity';
import { ExtraInformation } from 'src/client/entities/extra-information.entity';

@Injectable()
export class GuideliAIService {
  constructor(private readonly httpService: HttpService) {}

  async generatePetitionLetter(
    createPetitionLetterDto: CreatePetitionLetterDto,
    useSearch: boolean = true,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.post<CreatePetitionResponseDto>(
        `/v2/eb2/petition_letter?use_search=${useSearch}`,
        createPetitionLetterDto,
      ),
    );
    return data;
  }

  async generateRecommendationLetter(
    createRecommendationLetterDto: CreatePetitionLetterDto,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.post<CreatePetitionResponseDto>(
        '/v2/eb2/recommendation_letter',
        createRecommendationLetterDto,
      ),
    );
    return data;
  }

  async generateEndeavours(
    generateEndeavoursDto: GenerateEndeavoursDto,
    useSearch: boolean = true,
    numOfEndeavours: number = 2,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.post<GenerateEndeavoursResponseDto>(
        `/v2/eb2/endeavours?use_search=${useSearch}&num_of_endeavours=${numOfEndeavours}`,
        generateEndeavoursDto,
      ),
    );
    return data;
  }

  // async extractor(generateEndeavoursDto: GenerateEndeavoursDto) {
  //   const response = await lastValueFrom(
  //     this.httpService.post<string>(
  //       '/v2/eb2/endeavours',
  //       generateEndeavoursDto,
  //     ),
  //   );
  //   return response;
  // }

  async extractEducation(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<EducationHistory>>>
      >(
        `/extractor/educations?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }

  async extractEmployments(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<EmploymentHistory>>>
      >(
        `extractor/employments?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }

  async extractProjects(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `extractor/projects?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }

  async extractProffessionalContributions(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `extractor/professional_contributions?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }

  async extractAwards(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `extractor/awards?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }

  async extractLicenses(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `extractor/licenses?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }

  async extractCertification(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `/extractor/certifications?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }
  async extractAchievements(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `/extractor/achievements?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }
  async extractAssociations(uri: string, treatAsText = false) {
    const { data } = await lastValueFrom(
      this.httpService.post<
        GenerateResponseDto<Record<string, Partial<ExtraInformation>>>
      >(
        `/extractor/associations?s3_uri=${encodeURIComponent(uri)}&treat_as_text=${treatAsText}`,
      ),
    );
    return data;
  }
  async extractData(uri: string) {
    const { data } = await lastValueFrom(
      this.httpService.post<GenerateAllResponseDto>(
        `extractor/extract_all?s3_uri=${encodeURIComponent(uri)}`,
      ),
    );

    return data;
  }
}
