import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Response } from '@/utils/utils';
import {
  Controller,
  Get,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoachCustomersService } from './coach-customers.service';

@ApiTags('CoachCustomers')
@UseInterceptors(ResponseInterceptor)
@Controller('coach-customers')
export class CoachCustomersController {
  constructor(private readonly coachCustomersService: CoachCustomersService) {}

  @ApiBearerAuth()
  @Get('get-coach-customers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  async getCoachCustomers(@Req() req) {
    const userId = req.user.user_id;
    if (userId) {
      return this.coachCustomersService.getCoachCustomers(userId);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }
}
