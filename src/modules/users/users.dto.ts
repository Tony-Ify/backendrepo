import { IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  state?: string;
}