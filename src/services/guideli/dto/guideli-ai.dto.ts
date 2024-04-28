import { EducationHistory } from 'src/client/entities/education-history.entity';
import { EmploymentHistory } from 'src/client/entities/employment-history.entity';
import { ExtraInformation } from 'src/client/entities/extra-information.entity';

export class CreatePetitionLetterDto {
  firstName: string;
  lastName: string;
  educationHistories: {
    id: string;
    institutionName: string;
    startDate: string;
    endDate: string;
    fieldOfStudy: string;
    qualificationEarned: string;
    earnedCertificateURI: string;
    transcriptCertificateURI: string;
    createdAt: string;
    updatedAt: string;
  }[];
  employmentHistories: {
    id: string;
    jobTitle: string;
    company: string;
    type: string;
    startDate: string;
    endDate: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }[];
  extraDetails: {
    id: string;
    type: string;
    name: string;
    detail: string;
    supportingDocumentsURIs: string[];
    links: string[];
    createdAt: string;
    updatedAt: string;
  }[];
  endeavours: {
    name: string;
    detail: string;
    linkedEducationHistories: string[];
    linkedEmploymentHistories: string[];
    linkedExtraDetails: string[];
  }[];
  recommendations: {
    id: string;
    name: string;
    title: string;
    relationship: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export class GenerateEndeavoursDto {
  firstName: string;
  lastName: string;
  educationHistories: {
    id: string;
    institutionName: string;
    startDate: string;
    endDate: string;
    fieldOfStudy: string;
    qualificationEarned: string;
    earnedCertificateURI: string;
    transcriptCertificateURI: string;
    createdAt: string;
    updatedAt: string;
  }[];
  employmentHistories: {
    id: string;
    jobTitle: string;
    company: string;
    type: string;
    startDate: string;
    endDate: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }[];
  extraDetails: {
    id: string;
    type: string;
    name: string;
    detail: string;
    supportingDocumentsURIs: string[];
    links: string[];
    createdAt: string;
    updatedAt: string;
  }[];
}

export class CreatePetitionResponseDto {
  message: string;
  processing_time: string;
  exhbits_mappings: string[];
}

export class GenerateEndeavoursResponseDto {
  message: Record<string, string>;
  processing_time: string;
}

export class GenerateResponseDto<T> {
  message: T;
  processing_time: string;
}

export class GenerateAllResponseDto {
  data: {
    educations: Record<string, Partial<EducationHistory>>;
    employments: Record<string, Partial<EmploymentHistory>>;
    projects: Record<string, Partial<ExtraInformation>>;
    awards: Record<string, Partial<ExtraInformation>>;
    professional_contributions: Record<string, Partial<ExtraInformation>>;
    licenses: Record<string, Partial<ExtraInformation>>;
    certifications: Record<string, Partial<ExtraInformation>>;
    achievements: Record<string, Partial<ExtraInformation>>;
    associations: Record<string, Partial<ExtraInformation>>;
  };
  processing_time: 15.06;
}
