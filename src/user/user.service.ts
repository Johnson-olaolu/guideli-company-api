import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import * as otpGenerator from 'otp-generator';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { ConfirmUserDto } from 'src/auth/dto/confirm-user.dto';
import { Profile } from './entities/profile.entity';
import { POSTGRES_ERROR_CODES } from 'src/utils/constants';
import { RoleService } from './role/role.service';
import { QueryUserDto } from './dto/query-user.dto';
import { NotificationService } from 'src/notification/notification.service';
import { AcceptInviteDto } from 'src/auth/dto/accept-invite.dto';
import { CompanyService } from 'src/company/company.service';
import { InviteUsersDto } from './dto/invite-users.dto';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
    private roleService: RoleService,
    private notificationService: NotificationService,
    private companyService: CompanyService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto, type: 'invite' | 'create') {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (type === 'create') {
        const userProfile = await this.profileRepository.create(createUserDto);
        await queryRunner.manager.save(userProfile);
        const role = await this.roleService.findOneByName(createUserDto.role);
        const newUser = await this.userRepository.create({
          ...createUserDto,
          role: role,
          acceptedInvite: true,
          profile: userProfile,
        });
        const userWithEmail = await this.generateConfirmUserEmailToken(newUser);
        await queryRunner.manager.save(userWithEmail);
        await queryRunner.commitTransaction();
        return userWithEmail;
      } else {
        const role = await this.roleService.findOneByName(createUserDto.role);
        const newUser = await this.userRepository.create({
          ...createUserDto,
          role: role,
          isEmailVerified: true,
        });
        return newUser;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error?.code == POSTGRES_ERROR_CODES.unique_violation) {
        throw new BadRequestException(error.detail);
      }
      throw new InternalServerErrorException(error.detail);
    } finally {
      await queryRunner.release();
    }
  }

  async addAdmin(companyId: string, createUserDto: CreateUserDto) {
    const company = await this.companyService.findOne(companyId);
    const user = await this.create(
      {
        ...createUserDto,
        password: createUserDto.password,
        role: createUserDto.role || 'admin',
      },
      'create',
    );
    user.company = company;
    await user.save();
    this.notificationService.sendCompanyRegistrationSuccess(user, company);
    return user;
  }

  async inviteUsers(inviteUsersDto: InviteUsersDto) {
    const company = await this.companyService.findOne(inviteUsersDto.companyId);
    const users = [];
    for (const email of inviteUsersDto.userEmails) {
      try {
        const user = await this.create(
          {
            email,
            password: Math.random().toString(36).slice(-8),
            role: 'editor',
          },
          'invite',
        );
        user.company = company;
        await user.save();
        this.notificationService.sendInviteUserEmail(user, company);
        users.push(user);
      } catch (error) {
        console.log(error);
      }
    }
    return users;
  }

  async acceptInvite(acceptInviteDto: AcceptInviteDto) {
    const company = await this.companyService.findOneByName(
      acceptInviteDto.companyName,
    );
    const user = await this.findOneByEmail(acceptInviteDto.email);
    if (company.name !== user.companyName) {
      throw new BadRequestException(`You are not allowed to join this company`);
    }
    const profile = await this.profileRepository.save({
      ...acceptInviteDto,
    });
    user.profile = profile;
    user.acceptedInvite = true;
    user.password = acceptInviteDto.password;
    await user.save();
    return user;
  }

  async generateConfirmUserEmailToken(user: User) {
    const verificationToken = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenTTL = expire.toDate();
    await this.notificationService.sendRegistrationSuccessNotification(user);
    return user;
  }

  async confirmUserEmail(confirmUserDto: ConfirmUserDto) {
    const user = await this.findOneByEmail(confirmUserDto.email);
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (
      currentDate > moment(user.emailVerificationTokenTTL).toDate().valueOf()
    ) {
      throw new UnauthorizedException('Token Expired');
    }
    if (confirmUserDto.token !== user.emailVerificationToken) {
      throw new UnauthorizedException('Invalid Token');
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenTTL = null;
    await user.save();
    return user;
  }

  async generatePasswordResetToken(user: User) {
    const passwordResetToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');

    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenTTL = moment(expire, true)
      .tz('Africa/Lagos')
      .toDate();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const passwordResetUrl = `${this.configService.get(
      'CLIENT_URL',
    )}/auth/reset-password?email=${user.email}&token=${
      user.passwordResetToken
    }`;

    //send password reset link

    await user.save();
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findOneByEmail(changePasswordDto.email);
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (currentDate > moment(user.passwordResetTokenTTL).valueOf()) {
      throw new UnauthorizedException('Token Expired');
    }
    if (changePasswordDto.token !== user.passwordResetToken) {
      throw new UnauthorizedException('Invalid Token');
    }

    user.password = changePasswordDto.password;
    user.passwordResetToken = null;
    user.passwordResetTokenTTL = null;
    await user.save();
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async query(query: QueryUserDto) {
    const users = await this.userRepository.find({
      where: [
        {
          company: {
            id: query.companyId,
          },
          acceptedInvite: query.acceptedInvite,
        },
      ],
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { profile: true },
    });
    if (!user) {
      throw new NotFoundException(`User not found for this id ${id}`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { profile: true },
    });
    if (!user) {
      throw new NotFoundException(`user not found for this email: ${email}`);
    }
    return user;
  }

  async getUserProfile(id: string) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });
    return profile;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    for (const key in updateUserDto) {
      user[key] = updateUserDto[key];
    }
    await user.save();
    return user;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.getUserProfile(id);
    for (const key in updateProfileDto) {
      profile[key] = updateProfileDto[key];
    }
    await profile.save();
    const updatedUser = await this.findOne(id);
    return updatedUser;
  }

  async remove(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('User not found for this ID');
    }
  }
}
