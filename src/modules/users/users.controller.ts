import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UpdateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put(':id/state')
  @UseGuards(JwtAuthGuard)
  async updateUserState(@Param('id') id: string, @Body('state') state: string) {
    return this.usersService.updateState(Number(id), state);
  }
}