import { IsNumber, IsString, IsEnum } from 'class-validator';
import { State } from '../auth/auth.dto';

export class CreateVoteDto {
  @IsNumber()
  pollId!: number;

  @IsNumber()
  optionId!: number;

  @IsEnum(State)
  state!: State;
}

export class VoteResponseDto {
  id!: number;
  userId!: number;
  pollId!: number;
  optionId!: number;
  state!: string;
  createdAt!: Date;
}

export class VoteStatsDto {
  optionId!: number;
  optionText!: string;
  voteCount!: number;
  percentage!: number;
}

export class VoteResultsDto {
  pollId!: number;
  pollTitle!: string;
  totalVotes!: number;
  stats!: VoteStatsDto[];
}

export class VoteResultsByStateDto {
  pollId!: number;
  pollTitle!: string;
  selectedState!: string;
  totalVotesInState!: number;
  stats!: VoteStatsDto[];
}

export class AllStatesVoteResultsDto {
  pollId!: number;
  pollTitle!: string;
  totalVotes!: number;
  optionId!: number;
  optionText!: string;
  votesByState!: {
    [state: string]: number;
  };
  stateWithMostVotes!: {
    state: string;
    votes: number;
  };
}