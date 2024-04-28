import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { CompanyService } from 'src/company/company.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { EnvironmentVariables } from 'src/utils/env.validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private companyService: CompanyService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async checkCompanyNameAvailable(name: string) {
    try {
      const company = await this.companyService.findOneByName(name);
      if (company) {
        return false;
      }
    } catch (error) {
      if (error.status == 404) {
        return true;
      } else throw new InternalServerErrorException(error.detail);
    }
  }

  async register(registerUserDto: RegisterDto) {
    const company = await this.companyService.create({
      name: registerUserDto.companyName,
    });
    const companyAdmin = await this.userService.addAdmin(
      company.id,
      registerUserDto,
    );
    return companyAdmin;
  }

  async acceptInvite(acceptInviteDto: AcceptInviteDto) {
    const user = await this.userService.acceptInvite(acceptInviteDto);
    return user;
  }

  // async googleLogin(data: IGoogleUser) {
  //   try {
  //     const user = await this.userService.findOneByEmail(data.email);
  //     return this.loginUser(user);
  //   } catch (error) {
  //     if (error.status === 404) {
  //       interface IGoogleCreateUserDto extends CreateUserDto {
  //         isEmailVerified: boolean;
  //         role?: string;
  //       }
  //       const userDetails: IGoogleCreateUserDto = {
  //         email: data.email,
  //         lastName: data.lastName,
  //         firstName: data.firstName,
  //         isEmailVerified: true,
  //         password: data.providerId,
  //       };
  //       const user = await this.registerNewUser(userDetails);
  //       return user;
  //     }
  //     throw new InternalServerErrorException(error.detail);
  //   }
  // }

  loginUser(user: User) {
    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
      user: user,
    };
  }

  public async getAuthenticatedUser(usernameOrEmail: string, password: string) {
    const user = await this.userService.findOneByEmail(usernameOrEmail);
    if (!user.comparePasswords(password)) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return user;
  }

  async generateConfirmAccountToken(email: string) {
    const user = await this.userService.findOneByEmail(email);
    const userWithToken =
      await this.userService.generateConfirmUserEmailToken(user);
    return userWithToken;
  }

  async confirmNewUserEmail(confirmUserDto: ConfirmUserDto) {
    await this.userService.confirmUserEmail(confirmUserDto);
    return `${this.configService.get(`CLIENT_URL`)}/auth/login`;
  }

  async getPasswordResetLink(email: string) {
    const user = await this.userService.findOneByEmail(email);
    const userWithToken =
      await this.userService.generatePasswordResetToken(user);
    return userWithToken;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userService.changePassword(changePasswordDto);
    return user;
  }
}
