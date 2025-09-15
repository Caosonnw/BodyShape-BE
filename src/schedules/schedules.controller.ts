import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { CreateTrainingScheduleDto } from '@/schedules/dto/create-schedule.dto';
import { UpdateTrainingScheduleDto } from '@/schedules/dto/update-schedule.dto';
import { Response } from '@/utils/utils';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@UseInterceptors(ResponseInterceptor)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @ApiBearerAuth()
  @Get('get-schedules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  async getSchedules(@Req() req) {
    const userId = req.user.user_id;
    if (userId) {
      return this.schedulesService.getSchedules(userId);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @Post('create-schedules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COACH)
  async createSchedules(@Req() req, @Body() body: CreateTrainingScheduleDto) {
    const userId = req.user.user_id;
    if (userId) {
      return this.schedulesService.createSchedules(userId, body);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @Put('update-schedules/:schedule_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COACH)
  @ApiParam({ name: 'schedule_id', description: 'Schedule_id ID' })
  async updateSchedules(
    @Req() req,
    @Param('schedule_id') scheduleId: string,
    @Body() body: UpdateTrainingScheduleDto,
  ) {
    const userId = req.user.user_id;
    if (userId) {
      return this.schedulesService.updateSchedules(userId, scheduleId, body);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }
}
