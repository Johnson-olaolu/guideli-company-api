import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientProfile } from './entities/clientProfile.entity';
import { CompanyModule } from 'src/company/company.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientProfile]),
    CompanyModule,
    UserModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
