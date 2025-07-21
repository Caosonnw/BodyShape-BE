import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { UserRole } from '@/auth/guards/roles/user.roles';

@ApiTags('Checkins')
@UseInterceptors(ResponseInterceptor)
@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-all-checkins')
  async getAllCheckins() {
    return await this.checkinsService.getAllCheckins();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-checkin-by-today')
  async getCheckinByToday() {
    return await this.checkinsService.getCheckinByToday();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-checkin-by-today-user/:userId')
  async getCheckinByTodayUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.checkinsService.getCheckinByTodayUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-checkin-by-user/:userId')
  async getCheckinByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.checkinsService.getCheckinByUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Post('create-checkin/:userId')
  async createCheckin(@Param('userId', ParseIntPipe) userId: number) {
    return await this.checkinsService.createCheckin(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Post('create-checkout/:userId')
  async createCheckout(@Param('userId', ParseIntPipe) userId: number) {
    return await this.checkinsService.createCheckout(userId);
  }
}
