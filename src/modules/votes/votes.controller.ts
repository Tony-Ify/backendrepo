import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './vote.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async submitVote(@Request() req: any, @Body() createVoteDto: CreateVoteDto) {
    return this.votesService.submitVote(req.user.sub, createVoteDto);
  }

  @Get('poll/:pollId/user-vote')
  @UseGuards(JwtAuthGuard)
  async getUserPollVote(@Request() req: any, @Param('pollId') pollId: string) {
    return this.votesService.getUserPollVote(req.user.sub, Number(pollId));
  }

  @Get('poll/:pollId')
  async getPollVotes(@Param('pollId') pollId: string) {
    return this.votesService.getPollVotes(Number(pollId));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteVote(@Param('id') id: string) {
    await this.votesService.deleteVote(Number(id));
    return { message: 'Vote deleted successfully' };
  }
}

@Controller('results')
export class ResultsController {
  constructor(private votesService: VotesService) {}

  @Get(':pollId')
  async getPollResults(@Param('pollId') pollId: string) {
    return this.votesService.getPollResults(Number(pollId));
  }

  @Get(':pollId/by-state')
  async getPollResultsByState(
    @Param('pollId') pollId: string,
    @Body('state') state: string,
  ) {
    return this.votesService.getPollResultsByState(Number(pollId), state);
  }

  @Get(':pollId/by-states')
  async getPollResultsByAllStates(@Param('pollId') pollId: string) {
    return this.votesService.getPollResultsByAllStates(Number(pollId));
  }
}