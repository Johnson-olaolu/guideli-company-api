import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Profile } from 'src/user/entities/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from 'src/guards/loginGuard.guard';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Response } from 'express';
import { AcceptInviteDto } from './dto/accept-invite.dto';

@ApiTags('Auth')
@ApiExtraModels(User, Profile)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Your account has been created, please confirm your email',
      data: data,
    };
  }

  @Get('check-company-name')
  async validateCompanyName(@Query('name') name: string) {
    const data = await this.authService.checkCompanyNameAvailable(name);
    return {
      success: true,
      message: 'check completed',
      data: data,
    };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Req() request: Request) {
    const user = (request as any).user as User;
    const data = await this.authService.loginUser(user);
    return {
      success: true,
      message: 'user logged in successfully',
      data: data,
    };
  }

  @HttpCode(200)
  @Post('accept-invite')
  async acceptInvite(@Body() acceptInviteDto: AcceptInviteDto) {
    const data = await this.authService.acceptInvite(acceptInviteDto);
    return {
      success: true,
      message: 'invite accepted successfully',
      data: data,
    };
  }

  @ApiBearerAuth()
  @Get('confirm-email')
  async getConfirmEmailToken(@Query('email') email: string) {
    await this.authService.generateConfirmAccountToken(email);
    return {
      success: true,
      message: 'New token generated, Please check your email',
    };
  }

  @ApiBearerAuth()
  @HttpCode(201)
  @HttpCode(201)
  @Get('confirm-email/confirm')
  async confirmEmail(
    @Query() confirmUserDto: ConfirmUserDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.confirmNewUserEmail(confirmUserDto);
    return res.redirect(data);
  }

  @Get('change-password')
  async getPasswordResetLink(@Query('email') email: string) {
    await this.authService.getPasswordResetLink(email);
    return {
      success: true,
      message: 'Password reset link sent to your mail',
    };
  }

  @HttpCode(201)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const data = await this.authService.changePassword(changePasswordDto);
    return {
      success: true,
      message: 'Password changed Succesfully',
      data,
    };
  }
}
