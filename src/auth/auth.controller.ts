import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
interface RequestWithUser {
  user: {
    userId?: number;
    sub?: number;
    id?: number;
  };
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: RequestWithUser) {
    const targetId = req.user.userId || req.user.sub || req.user.id;

    return this.authService.getProfile(Number(targetId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    return {
      message:
        'Logout successful. You may safely remove the token on the client side.',
    };
  }
}
