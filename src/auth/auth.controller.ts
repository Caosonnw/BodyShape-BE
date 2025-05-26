import { LoginUserDto } from '@/auth/auth-dto/login-user.dto';
import { RegisterUserDto } from '@/auth/auth-dto/register-user-dto';
import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Role } from '@/utils/type';
import { Response } from '@/utils/utils';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() RegisterUserDto: RegisterUserDto) {
    return this.authService.register(RegisterUserDto);
  }

  @Post('login')
  login(@Body() LoginUserDto: LoginUserDto, @Res({ passthrough: true }) res) {
    return this.authService.login(LoginUserDto, res);
  }

  @ApiExcludeEndpoint()
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken, @Res({ passthrough: true }) res) {
    return await this.authService.refreshToken(refreshToken.refreshToken, res);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.COACH, Role.CUSTOMER)
  @Get('test-me')
  getMeTest(@Req() req) {
    if (req.user) {
      return Response('Get me successfully!', HttpStatus.OK, req.user);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }
}
