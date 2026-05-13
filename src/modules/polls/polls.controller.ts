import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  CreatePollDto,
  UpdatePollDto,
  UpdatePollStatusDto,
  PollResponseDto,
} from './poll.dto';
import { Poll, PollStatus } from './entities/poll.entity';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPolls(
    @Query('status') status?: PollStatus,
  ): Promise<Poll[]> {
    if (status) {
      return await this.pollsService.findAll(status);
    }
    return await this.pollsService.findAll();
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  async getActivePolls(): Promise<Poll[]> {
    return await this.pollsService.findActive();
  }

  @Get('closed')
  @HttpCode(HttpStatus.OK)
  async getClosedPolls(): Promise<Poll[]> {
    return await this.pollsService.findClosed();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPollById(@Param('id') id: number): Promise<Poll> {
    return await this.pollsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @Request() req,
  ): Promise<Poll> {
    return await this.pollsService.create(createPollDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updatePoll(
    @Param('id') id: number,
    @Body() updatePollDto: UpdatePollDto,
    @Request() req,
  ): Promise<Poll> {
    return await this.pollsService.update(id, updatePollDto, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updatePollStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdatePollStatusDto,
    @Request() req,
  ): Promise<Poll> {
    return await this.pollsService.updateStatus(
      id,
      updateStatusDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePoll(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.pollsService.delete(id, req.user.id);
  }
}