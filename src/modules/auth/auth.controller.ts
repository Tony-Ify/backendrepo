import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, AuthResponseDto } from './auth.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Request() req: any) {
    return { valid: true, userId: req.user.sub };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user.sub);
  }
}