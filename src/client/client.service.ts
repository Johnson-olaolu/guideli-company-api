import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ILike, Repository } from 'typeorm';
import { ClientProfile } from './entities/clientProfile.entity';
import { CompanyService } from 'src/company/company.service';
import { UserService } from 'src/user/user.service';
import { FileService } from 'src/file/file.service';
import { QueryClientDto } from './dto/query-client.dto';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { UpdateClientDefaultProfileDto } from './dto/update-default-profile.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>,
    private companyService: CompanyService,
    private userService: UserService,
    private fileService: FileService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const company = await this.companyService.findOne(
      createClientDto.companyId,
    );
    const lawyer = await this.userService.findOne(createClientDto.lawyerId);
    const client = await this.clientRepository.save({
      ...createClientDto,
      company,
      lawyer,
    });
    const clientProfile = await this.clientProfileRepository.create({
      firstName: createClientDto.firstName,
      lastName: createClientDto.lastName,
      client,
    });

    if (createClientDto.cv) {
      const cv = await this.fileService.findOne(createClientDto.cv);
      clientProfile.cv = cv;
      //create details from cv
    }
    await clientProfile.save();
    client.defautProfile = clientProfile;
    await client.save();
    return client;
  }

  async findAll() {
    const clients = await this.clientRepository.find();
    return clients;
  }

  async query(queryClientDto: QueryClientDto) {
    const clients = await this.clientRepository.find({
      where: [
        {
          company: {
            id: queryClientDto.companyId,
          },
          lawyer: {
            id: queryClientDto.lawyerId,
          },
          defautProfile: {
            firstName: ILike(`%${queryClientDto.search}%`),
          },
        },
        {
          company: {
            id: queryClientDto.companyId,
          },
          lawyer: {
            id: queryClientDto.lawyerId,
          },
          defautProfile: {
            lastName: ILike(`%${queryClientDto.search}%`),
          },
        },
        {
          company: {
            id: queryClientDto.companyId,
          },
          lawyer: {
            id: queryClientDto.lawyerId,
          },
          email: ILike(`%${queryClientDto.search}%`),
        },
      ],
    });
    return clients;
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { defautProfile: true },
    });
    if (!client) {
      throw new NotFoundException(`Client not found for this id: ${id}`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    const payload: any = updateClientDto;
    if (updateClientDto.lawyerId) {
      const lawyer = await this.userService.findOne(updateClientDto.lawyerId);
      payload.lawyer = lawyer;
    }
    for (const key in payload) {
      client[key] = payload[key];
    }
    await client.save();
    return client;
  }

  async createProfile(
    id: string,
    createClientProfileDto: CreateClientProfileDto,
  ) {
    const client = await this.findOne(id);
    const clientProfile = await this.clientProfileRepository.save({
      firstName: createClientProfileDto.firstName,
      lastName: createClientProfileDto.lastName,
      client,
    });

    if (createClientProfileDto.cvId) {
      const file = await this.fileService.findOne(createClientProfileDto.cvId);
      //get info from cv
    }
    return clientProfile;
  }

  async findOneProfile(id: string) {
    const clientProfile = await this.clientProfileRepository.findOne({
      where: { id },
    });
    if (!clientProfile) {
      throw new NotFoundException(`Client not found for this id: ${id}`);
    }
    return clientProfile;
  }

  async fetchClientProfiles(id: string) {
    const client = await this.clientProfileRepository.find({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client not found for this id: ${id}`);
    }
    return client;
  }

  async updateProfile(
    id: string,
    updateClientProfileDto: UpdateClientProfileDto,
  ) {
    const clientProfile = await this.findOneProfile(id);
    for (const key in updateClientProfileDto) {
      clientProfile[key] = updateClientProfileDto[key];
    }
    if (updateClientProfileDto.cvId) {
      const file = await this.fileService.findOne(updateClientProfileDto.cvId);
      //fill informarmation from cv
    }
    await clientProfile.save();
    return clientProfile;
  }

  async updateProfileDefault(
    id: string,
    updateClientProfileDto: UpdateClientDefaultProfileDto,
  ) {
    const client = await this.findOne(id);
    const clientProfile = await this.clientProfileRepository.findOne({
      where: { id: updateClientProfileDto.profileId },
    });
    client.defautProfile = clientProfile;
    await client.save();
    return client;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
