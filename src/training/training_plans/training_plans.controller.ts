import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { CreateTrainingPlanDto } from '@/training/training_plans/dto/create-plans.dto';
import { UpdateTrainingPlanDto } from '@/training/training_plans/dto/update-plans.dto';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrainingPlansService } from './training_plans.service';

@ApiTags('Training Plans')
@UseInterceptors(ResponseInterceptor)
@Controller('training-plans')
export class TrainingPlansController {
  constructor(private readonly trainingPlansService: TrainingPlansService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-all-training-plans')
  async getAllTrainingPlans() {
    return this.trainingPlansService.getAllTrainingPlans();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-training-plan-by-id/:training_plan_id')
  async getTrainingPlanById(
    @Param('training_plan_id', ParseIntPipe) training_plan_id: number,
  ) {
    return this.trainingPlansService.getTrainingPlanById(training_plan_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Post('create-training-plan')
  async createTrainingPlan(
    @Body() createTrainingPlanDto: CreateTrainingPlanDto,
  ) {
    return this.trainingPlansService.createTrainingPlan(createTrainingPlanDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Put('update-training-plan/:training_plan_id')
  async updateTrainingPlan(
    @Param('training_plan_id', ParseIntPipe) training_plan_id: number,
    @Body() createTrainingPlanDto: UpdateTrainingPlanDto,
  ) {
    return this.trainingPlansService.updateTrainingPlan(
      training_plan_id,
      createTrainingPlanDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Delete('delete-training-plan/:training_plan_id')
  async deleteTrainingPlan(
    @Param('training_plan_id', ParseIntPipe) training_plan_id: number,
  ) {
    return this.trainingPlansService.deleteTrainingPlan(training_plan_id);
  }
}
