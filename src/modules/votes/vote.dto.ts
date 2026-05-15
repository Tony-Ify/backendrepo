import { IsNumber, IsString, IsEnum } from 'class-validator';

enum State {
  Lagos = 'Lagos',
  Abuja = 'Abuja',
  Kano = 'Kano',
  // ... include all 36 states
}

export class CreateVoteDto {
  @IsNumber()
  pollId!: number;

  @IsNumber()
  optionId!: number;

  @IsString()
  state!: string;
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
  totalVotes!: number;
  stats!: VoteStatsDto[];
}

export class VoteResultsByStateDto extends VoteResultsDto {
  state!: string;
}