import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryBuilder } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './vote.dto';
import { PollsService } from '../polls/polls.service';
import { PollStatus } from '../polls/entities/poll.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private pollsService: PollsService,
  ) {}

  async submitVote(createVoteDto: CreateVoteDto, userId: number): Promise<Vote> {
    const { pollId, optionId, state } = createVoteDto;

    // Verify poll exists and is active
    const poll = await this.pollsService.findById(pollId);
    if (poll.status === PollStatus.CLOSED) {
      throw new BadRequestException('This poll is closed');
    }

    // Verify option belongs to this poll
    const option = await this.pollsService.getPollOption(optionId);
    if (option.pollId !== pollId) {
      throw new BadRequestException('Option does not belong to this poll');
    }

    // Check if user already voted on this poll
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

    return await this.votesRepository.save(vote);
  }

  async getUserPollVote(userId: number, pollId: number): Promise<Vote | null> {
    return await this.votesRepository.findOne({
      where: {
        userId,
        pollId,
      },
      relations: ['option'],
    });
  }

  async getPollVotes(pollId: number): Promise<Vote[]> {
    return await this.votesRepository.find({
      where: { pollId },
      relations: ['user', 'option'],
    });
  }

  async getVoteCount(optionId: number): Promise<number> {
    return await this.votesRepository.count({
      where: { optionId },
    });
  }

  async getPollResults(pollId: number): Promise<{
    pollId: number;
    totalVotes: number;
    results: Array<{
      optionId: number;
      optionText: string;
      voteCount: number;
      percentage: number;
    }>;
  }> {
    const poll = await this.pollsService.findById(pollId);
    const votes = await this.getPollVotes(pollId);

    const results = poll.options.map(option => {
      const voteCount = votes.filter(v => v.optionId === option.id).length;
      const percentage =
        votes.length > 0 ? (voteCount / votes.length) * 100 : 0;

      return {
        optionId: option.id,
        optionText: option.optionText,
        voteCount,
        percentage: Math.round(percentage * 10) / 10,
      };
    });

    return {
      pollId,
      totalVotes: votes.length,
      results,
    };
  }

  async getPollResultsByState(
    pollId: number,
    state: string,
  ): Promise<{
    pollId: number;
    state: string;
    totalVotes: number;
    results: Array<{
      optionId: number;
      optionText: string;
      voteCount: number;
      percentage: number;
    }>;
  }> {
    const poll = await this.pollsService.findById(pollId);
    const votes = await this.votesRepository.find({
      where: { pollId, state },
    });

    const results = poll.options.map(option => {
      const voteCount = votes.filter(v => v.optionId === option.id).length;
      const percentage =
        votes.length > 0 ? (voteCount / votes.length) * 100 : 0;

      return {
        optionId: option.id,
        optionText: option.optionText,
        voteCount,
        percentage: Math.round(percentage * 10) / 10,
      };
    });

    return {
      pollId,
      state,
      totalVotes: votes.length,
      results,
    };
  }

  async getPollResultsByAllStates(pollId: number): Promise<{
    pollId: number;
    totalVotes: number;
    optionStats: Array<{
      optionId: number;
      optionText: string;
      votesByState: { [state: string]: number };
      totalVotes: number;
    }>;
  }> {
    const poll = await this.pollsService.findById(pollId);
    const votes = await this.getPollVotes(pollId);

    const stateMap = new Map<string, Set<number>>();
    const optionStateMap = new Map<
      number,
      Map<string, number>
    >();

    // Initialize maps
    poll.options.forEach(option => {
      optionStateMap.set(option.id, new Map());
    });

    // Process votes
    votes.forEach(vote => {
      // Track unique states
      if (!stateMap.has(vote.state)) {
        stateMap.set(vote.state, new Set());
      }
      stateMap.get(vote.state)?.add(vote.optionId);

      // Track votes by state for each option
      const stateVotes = optionStateMap.get(vote.optionId);
      if (stateVotes) {
        stateVotes.set(vote.state, (stateVotes.get(vote.state) || 0) + 1);
      }
    });

    const optionStats = Array.from(optionStateMap.entries()).map(
      ([optionId, stateVotes]) => {
        const votesByState: { [state: string]: number } = {};
        let totalVotes = 0;

        stateVotes.forEach((count, state) => {
          votesByState[state] = count;
          totalVotes += count;
        });

        const option = poll.options.find(o => o.id === optionId);

        return {
          optionId,
          optionText: option?.optionText || '',
          votesByState,
          totalVotes,
        };
      },
    );

    return {
      pollId,
      totalVotes: votes.length,
      optionStats,
    };
  }

  async deleteVote(voteId: number, userId: number): Promise<void> {
    const vote = await this.votesRepository.findOne({ where: { id: voteId } });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    if (vote.userId !== userId) {
      throw new BadRequestException(
        'You cannot delete another user\'s vote',
      );
    }

    await this.votesRepository.delete(voteId);
  }
}