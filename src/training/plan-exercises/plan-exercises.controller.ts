import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PlanExercisesService } from './plan-exercises.service';
import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { CreatePlanExerciseDto } from '@/training/plan-exercises/dto/create-plan-exercises.dto';
import { UpdatePlanExerciseDto } from '@/training/plan-exercises/dto/update-plan-exercises.dto';
import { Response } from '@/utils/utils';

@ApiTags('Plan Exercises')
@UseInterceptors(ResponseInterceptor)
@Controller('plan-exercises')
export class PlanExercisesController {
  constructor(private readonly planExercisesService: PlanExercisesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-all-plan-exercises')
  async getAllPlanExercises() {
    return this.planExercisesService.getAllPlanExercises();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Get('get-plan-exercises-by-id/:plan_exercise_id')
  async getPlanExerciseById(
    @Param('plan_exercise_id', ParseIntPipe) planExerciseId: number,
  ) {
    return this.planExercisesService.getPlanExerciseById(planExerciseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-plan-exercises-by-customer')
  async getPlanExercisesByCustomer(@Req() req) {
    const customerId = req.user.user_id;
    if (customerId) {
      return this.planExercisesService.getPlanExercisesByCustomer(customerId);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Post('create-plan-exercise')
  async createPlanExercise(
    @Body() createPlanExerciseDto: CreatePlanExerciseDto,
  ) {
    return this.planExercisesService.createPlanExercise(createPlanExerciseDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Put('update-plan-exercise/:plan_exercise_id')
  async updatePlanExercise(
    @Param('plan_exercise_id', ParseIntPipe) planExerciseId: number,
    @Body() updatePlanExerciseDto: UpdatePlanExerciseDto,
  ) {
    return this.planExercisesService.updatePlanExercise(
      planExerciseId,
      updatePlanExerciseDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Delete('delete-plan-exercise/:plan_exercise_id')
  async deletePlanExercise(
    @Param('plan_exercise_id', ParseIntPipe) planExerciseId: number,
  ) {
    return this.planExercisesService.deletePlanExercise(planExerciseId);
  }
}
