import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './entities/company-profile';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from 'src/guards/roleGuards.guard';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyOnboardingDto } from './dto/update-onboarding.dto';

@ApiBearerAuth()
@ApiTags('Company')
@ApiExtraModels(Company, CompanyProfile)
@UseGuards(AuthGuard('jwt'))
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(RoleGuard(['super_admin']))
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const data = await this.companyService.create(createCompanyDto);
    return {
      success: true,
      message: ' Company created successfully',
      data,
    };
  }

  @UseGuards(RoleGuard(['super_admin']))
  @Get()
  async findAll() {
    const data = await this.companyService.findAll();
    return {
      success: true,
      message: 'Companies  fetched successfully',
      data,
    };
  }

  @Get('name')
  async findOneByName(@Query('name') name: string) {
    const data = await this.companyService.findOneByName(name);
    return {
      success: true,
      message: 'Company fetched successfully by name',
      data,
    };
  }

  @Get(':companyId')
  async findOne(@Param('companyId') companyId: string) {
    const data = await this.companyService.findOne(companyId);
    return {
      success: true,
      message: 'Company fetched successfully',
      data,
    };
  }

  @Patch(':companyId/onboarding')
  async updateOnboardingStage(
    @Param('companyId') companyId: string,
    @Body() updateCompanyOnboardingDto: UpdateCompanyOnboardingDto,
  ) {
    const data = await this.companyService.updateOnboarding(
      companyId,
      updateCompanyOnboardingDto,
    );
    return {
      success: true,
      message: 'Company onboarding stage updated successfully',
      data,
    };
  }

  @Post(':companyId/profile')
  async createProfile(
    @Param('companyId') companyId: string,
    @Body() createCompanyProfileDto: CreateCompanyProfileDto,
  ) {
    const data = await this.companyService.createProfile(
      companyId,
      createCompanyProfileDto,
    );
    return {
      success: true,
      message: 'Company profile created successfully',
      data,
    };
  }

  @Patch(':companyId/profile/:profileId')
  updateCompanyProfile(
    @Param('profileId') profileId: string,
    @Body() updateCompanyProfile: UpdateCompanyProfileDto,
  ) {
    const data = this.companyService.updateProfile(
      profileId,
      updateCompanyProfile,
    );
    return {
      success: true,
      message: 'Company profile updated successfully',
      data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
