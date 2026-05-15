import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto, UpdatePollDto, UpdatePollStatusDto } from './poll.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  async getAllPolls(@Query('status') status?: 'active' | 'closed') {
    return this.pollsService.findAll(status);
  }

  @Get('active')
  async getActivePools() {
    return this.pollsService.findActive();
  }

  @Get('closed')
  async getClosedPolls() {
    return this.pollsService.findClosed();
  }

  @Get(':id')
  async getPollById(@Param('id') id: string) {
    return this.pollsService.findById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createPoll(@Request() req: any, @Body() createPollDto: CreatePollDto) {
    return this.pollsService.create(req.user.sub, createPollDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePoll(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollsService.update(Number(id), req.user.sub, updatePollDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePollStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateStatusDto: UpdatePollStatusDto,
  ) {
    return this.pollsService.updateStatus(Number(id), req.user.sub, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deletePoll(@Param('id') id: string, @Request() req: any) {
    await this.pollsService.delete(Number(id), req.user.sub);
    return { message: 'Poll deleted successfully' };
  }
}