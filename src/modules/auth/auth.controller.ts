import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request, 
  BadRequestException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, AuthResponseDto } from './auth.dto';
import { CreateAdminDto } from './create-admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
  
    const secretKey = this.configService.get<string>('ADMIN_SECRET_KEY');
    
    if (!createAdminDto.secretKey || createAdminDto.secretKey !== secretKey) {
      throw new BadRequestException('Invalid secret key');
    }

    return this.authService.createAdmin(createAdminDto);
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