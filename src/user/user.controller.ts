import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from 'src/guards/roleGuards.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { InviteUsersDto } from './dto/invite-users.dto';

@UseGuards(AuthGuard('jwt'))
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @UseGuards(RoleGuard(['super-admin']))
  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return {
      success: true,
      message: 'Users fetched successfully',
      data,
    };
  }

  @Get('me')
  async getUserDetails(@Req() request: Request) {
    const user = (request as any).user;
    const data = await this.userService.findOne(user.id);
    return {
      success: true,
      message: 'User fetched successfully',
      data,
    };
  }

  @UseGuards(RoleGuard(['admin']))
  @Post('invite-users')
  async inviteUsers(@Body() inviteUsersDto: InviteUsersDto) {
    const data = await this.userService.inviteUsers(inviteUsersDto);
    return {
      success: true,
      message: 'Users fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(id);
    return {
      success: true,
      message: 'User fetched successfully',
      data,
    };
  }

  @UseGuards(RoleGuard(['super-admin']))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
