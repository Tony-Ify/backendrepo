import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import {JwtAuthGuard} from 'src/common/guards/jwt-auth.guard';
import { CreateVoteDto } from './vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async submitVote(@Body() createVoteDto: CreateVoteDto, @Request() req) {
    return await this.votesService.submitVote(createVoteDto, req.user.id);
  }

  @Get('poll/:pollId')
  @HttpCode(HttpStatus.OK)
  async getPollVotes(@Param('pollId') pollId: number) {
    return await this.votesService.getPollVotes(pollId);
  }

  @Get('user/:pollId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserPollVote(
    @Param('pollId') pollId: number,
    @Request() req,
  ) {
    return await this.votesService.getUserPollVote(req.user.id, pollId);
  }
}

@Controller('results')
export class ResultsController {
  constructor(private votesService: VotesService) {}

  @Get(':pollId')
  @HttpCode(HttpStatus.OK)
  async getPollResults(@Param('pollId') pollId: number) {
    return await this.votesService.getPollResults(pollId);
  }

  @Get(':pollId/by-state')
  @HttpCode(HttpStatus.OK)
  async getPollResultsByState(
    @Param('pollId') pollId: number,
    @Query('state') state: string,
  ) {
    if (!state) {
      throw new Error('State parameter is required');
    }
    return await this.votesService.getPollResultsByState(pollId, state);
  }

  @Get(':pollId/all-states')
  @HttpCode(HttpStatus.OK)
  async getPollResultsByAllStates(@Param('pollId') pollId: number) {
    return await this.votesService.getPollResultsByAllStates(pollId);
  }
}