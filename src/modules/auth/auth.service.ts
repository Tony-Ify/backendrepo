import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignUpDto, LoginDto, AuthResponseDto } from './auth.dto';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { name, email, password, state } = signUpDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      state,
    });

    const accessToken = this.generateAccessToken(user.id, user.email, user.role);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      state: user.state,
      role: user.role,
      accessToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '7d',
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user.id, user.email, user.role);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      state: user.state,
      role: user.role,
      accessToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '7d',
    };
  }

  async validateUser(id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refreshToken(userId: number): Promise<{ accessToken: string }> {
    const user = await this.validateUser(userId);
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    return { accessToken };
  }

  private generateAccessToken(userId: number, email: string, role: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRATION') || '7d';
    return this.jwtService.sign(payload, { expiresIn });
  }
}