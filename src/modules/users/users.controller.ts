import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req): Promise<Omit<User, 'password'>> {
    return await this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return await this.usersService.update(req.user.id, updateData);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findById(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put(':id/state')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateState(
    @Request() req,
    @Param('id') id: number,
    @Body() { state }: { state: string },
  ): Promise<User> {
    // Users can only update their own state
    if (req.user.id !== id) {
      throw new Error('You can only update your own state');
    }
    return await this.usersService.updateState(id, state);
  }
}