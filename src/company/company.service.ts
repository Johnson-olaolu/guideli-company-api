import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyProfile } from './entities/company-profile';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { NotificationService } from 'src/notification/notification.service';
import { UpdateCompanyOnboardingDto } from './dto/update-onboarding.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
    private notificationService: NotificationService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create({
      ...createCompanyDto,
    });
    await company.save();
    return company;
  }

  async findAll() {
    const companies = await this.companyRepository.find();
    return companies;
  }

  async findOne(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
      relations: { profile: true },
    });
    if (!company) {
      throw new NotFoundException(`Company not found for this id ${companyId}`);
    }
    return company;
  }

  async findOneByName(companyName: string) {
    const company = await this.companyRepository.findOne({
      where: {
        name: companyName,
      },
      relations: { profile: true },
    });
    if (!company) {
      throw new NotFoundException(
        `Company not found for this name ${companyName}`,
      );
    }
    return company;
  }

  // update(id: number, updateCompanyDto: UpdateCompanyDto) {
  //   return `This action updates a #${id} company`;
  // }

  async updateOnboarding(
    companyId: string,
    updateCompanyOnboardingDto: UpdateCompanyOnboardingDto,
  ) {
    const company = await this.findOne(companyId);
    company.onboardingStage = updateCompanyOnboardingDto.stage;
    await company.save();
    return company;
  }

  async createProfile(
    companyId: string,
    createCompanyProfileDto: CreateCompanyProfileDto,
  ) {
    const company = await this.findOne(companyId);
    const companyProfile = await this.companyProfileRepository.save({
      ...createCompanyProfileDto,
      company,
    });
    await company.save();
    return companyProfile;
  }

  async findOneProfile(companyProfileId: string) {
    const companyProfile = await this.companyProfileRepository.findOne({
      where: {
        id: companyProfileId,
      },
    });
    if (!companyProfile) {
      throw new NotFoundException(
        `Company Profile not found for this id ${companyProfileId}`,
      );
    }
    return companyProfile;
  }

  async updateProfile(
    companyProfileId,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
  ) {
    const companyProfile = await this.findOneProfile(companyProfileId);
    for (const key in companyProfile) {
      companyProfile[key] = updateCompanyProfileDto[key];
    }
    await companyProfile.save();
    return companyProfile;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
