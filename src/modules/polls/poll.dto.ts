import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {PollStatus } from './entities/poll.entity';

export class CreatePollOptionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  optionText!: string;

  @IsOptional()
  displayOrder?: number;
}

export class CreatePollDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => CreatePollOptionDto)
  options!: CreatePollOptionDto[];
}

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => CreatePollOptionDto)
  options?: CreatePollOptionDto[];
}

export class UpdatePollStatusDto {
  @IsEnum(PollStatus)
  status!: PollStatus;
}

export class PollOptionResponseDto {
  id!: number;
  pollId!: number;
  optionText!: string;
  displayOrder!: number;
  createdAt!: Date;
  voteCount?: number;
}

export class PollResponseDto {
  id!: number;
  title!: string;
  description!: string;
  status!: PollStatus;
  createdById!: number;
  createdBy!: {
    id: number;
    name: string;
    email: string;
  };
  options!: PollOptionResponseDto[];
  totalVotes!: number;
  createdAt!: Date;
  updatedAt!: Date;
  closedAt!: Date;
}

export class PollWithResultsDto extends PollResponseDto {
  options: (PollOptionResponseDto & {
    voteCount: number;
    percentage: number;
  })[];
  totalVotes: number;
}

export class PollWithResultsByStateDto extends PollResponseDto {
  options: (PollOptionResponseDto & {
    votesByState: {
      [state: string]: number;
    };
    totalVotes: number;
  })[];
  totalVotes: number;
}