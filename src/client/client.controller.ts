import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { UpdateClientDefaultProfileDto } from './dto/update-default-profile.dto';

@ApiTags('Client')
@UseGuards(AuthGuard('jwt'))
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    const data = await this.clientService.create(createClientDto);
    return {
      success: true,
      message: 'Client created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.clientService.findAll();
    return {
      success: true,
      message: 'Clients fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.clientService.findOne(id);
    return {
      success: true,
      message: 'Client fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const data = await this.clientService.update(id, updateClientDto);
    return {
      success: true,
      message: 'Client updated successfully',
      data,
    };
  }

  @Post(':id/profile')
  async createProfile(
    @Param('id') id: string,
    @Body() createClientProfileDto: CreateClientProfileDto,
  ) {
    const data = await this.clientService.createProfile(
      id,
      createClientProfileDto,
    );
    return {
      success: true,
      message: 'Client created successfully',
      data,
    };
  }

  @Patch(':id/profile/:profileId')
  async updateProfile(
    @Param('profileId') id: string,
    @Body() updateClientProfileDto: UpdateClientProfileDto,
  ) {
    const data = await this.clientService.updateProfile(
      id,
      updateClientProfileDto,
    );
    return {
      success: true,
      message: 'Client profile updated successfully',
      data,
    };
  }

  @Patch(':id/default-profile')
  async updateDefaultProfile(
    @Param('profileId') id: string,
    @Body() updateClientProfileDto: UpdateClientDefaultProfileDto,
  ) {
    const data = await this.clientService.updateProfileDefault(
      id,
      updateClientProfileDto,
    );
    return {
      success: true,
      message: 'Client profile updated successfully',
      data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
