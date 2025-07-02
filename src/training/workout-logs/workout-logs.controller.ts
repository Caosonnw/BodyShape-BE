import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { CreateWorkoutLogDto } from '@/training/workout-logs/dto/create-workout-log.dto';

@ApiTags('Workout Logs')
@UseInterceptors(ResponseInterceptor)
@Controller('workout-logs')
export class WorkoutLogsController {
  constructor(private readonly workoutLogsService: WorkoutLogsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Get('get-all-workout-logs')
  async getAllWorkoutLogs() {
    return this.workoutLogsService.getAllWorkoutLogs();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Get('get-workout-logs-by-id/:log_id')
  async getWorkoutLogsById(@Param('log_id', ParseIntPipe) log_id: number) {
    return this.workoutLogsService.getWorkoutLogsById(log_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Post('create-workout-log')
  async createWorkoutLog(@Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutLogsService.createWorkoutLog(createWorkoutLogDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Put('update-workout-log/:log_id')
  async updateWorkoutLog(
    @Param('log_id', ParseIntPipe) log_id: number,
    @Body() updateWorkoutLogDto: CreateWorkoutLogDto,
  ) {
    return this.workoutLogsService.updateWorkoutLog(
      log_id,
      updateWorkoutLogDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Delete('delete-workout-log/:log_id')
  async deleteWorkoutLog(@Param('log_id', ParseIntPipe) log_id: number) {
    return this.workoutLogsService.deleteWorkoutLog(log_id);
  }
}
