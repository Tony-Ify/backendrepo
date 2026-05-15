import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './vote.dto';
import { PollsService } from '../polls/polls.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private pollsService: PollsService,
  ) {}

  async submitVote(userId: number, createVoteDto: CreateVoteDto): Promise<Vote> {
    const { pollId, optionId, state } = createVoteDto;

    // Verify poll exists and is active
    const poll = await this.pollsService.findById(pollId);
    if (poll.status !== 'active') {
      throw new BadRequestException('This poll is not active');
    }

    // Verify option belongs to this poll
    const option = await this.pollsService.getPollOption(optionId);
    if (option.pollId !== pollId) {
      throw new BadRequestException('This option does not belong to this poll');
    }

    // Check if user already voted
    const existingVote = await this.votesRepository.findOne({
      where: {
        userId,
        pollId,
      },
    });

    if (existingVote) {
      throw new BadRequestException('You have already voted on this poll');
    }

    // Create and save vote
    const vote = this.votesRepository.create({
      userId,
      pollId,
      optionId,
      state,
    });

    return this.votesRepository.save(vote);
  }

  async getUserPollVote(userId: number, pollId: number): Promise<Vote | null> {
    return this.votesRepository.findOne({
      where: {
        userId,
        pollId,
      },
    });
  }

  async getPollVotes(pollId: number): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { pollId },
      relations: ['user'],
    });
  }

  async getVoteCount(pollId: number): Promise<number> {
    return this.votesRepository.count({
      where: { pollId },
    });
  }

  async getPollResults(pollId: number): Promise<any> {
    const votes = await this.getPollVotes(pollId);
    const options = await this.pollsService.getPollOptions(pollId);

    const stats = options.map(option => {
      const voteCount = votes.filter(v => v.optionId === option.id).length;
      const percentage =
        votes.length > 0 ? Math.round((voteCount / votes.length) * 100) : 0;

      return {
        optionId: option.id,
        optionText: option.optionText,
        voteCount,
        percentage,
      };
    });

    return {
      pollId,
      totalVotes: votes.length,
      stats,
    };
  }

  async getPollResultsByState(pollId: number, state: string): Promise<any> {
    const votes = await this.votesRepository.find({
      where: { pollId, state },
    });

    const options = await this.pollsService.getPollOptions(pollId);

    const stats = options.map(option => {
      const voteCount = votes.filter(v => v.optionId === option.id).length;
      const percentage =
        votes.length > 0 ? Math.round((voteCount / votes.length) * 100) : 0;

      return {
        optionId: option.id,
        optionText: option.optionText,
        voteCount,
        percentage,
      };
    });

    return {
      pollId,
      totalVotes: votes.length,
      state,
      stats,
    };
  }

  async getPollResultsByAllStates(pollId: number): Promise<any> {
    const allVotes = await this.getPollVotes(pollId);
    const options = await this.pollsService.getPollOptions(pollId);

    const states = [...new Set(allVotes.map(v => v.state))];
    const results: { [key: string]: any[] } = {};

    for (const state of states) {
      const stateVotes = allVotes.filter(v => v.state === state);

      results[state] = options.map(option => {
        const voteCount = stateVotes.filter(v => v.optionId === option.id).length;
        const percentage =
          stateVotes.length > 0
            ? Math.round((voteCount / stateVotes.length) * 100)
            : 0;

        return {
          optionId: option.id,
          optionText: option.optionText,
          voteCount,
          percentage,
        };
      });
    }

    return results;
  }

  async deleteVote(id: number): Promise<void> {
    const vote = await this.votesRepository.findOne({ where: { id } });
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }
    await this.votesRepository.remove(vote);
  }
}