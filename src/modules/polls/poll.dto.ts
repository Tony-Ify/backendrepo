import {
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer'; // ← CORRECT - from class-transformer, NOT class-validator

class PollOptionDto {
  @IsString()
  @MinLength(1)
  optionText!: string;
}

enum PollStatus {
  Active = 'active',
  Closed = 'closed',
}

export class CreatePollDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  options!: PollOptionDto[];
}

export class UpdatePollDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  options!: PollOptionDto[];
}

export class UpdatePollStatusDto {
  @IsEnum(PollStatus)
  status!: PollStatus;
}