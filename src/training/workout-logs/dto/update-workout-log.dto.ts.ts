import { CreateTrainingPlanDto } from '@/training/training_plans/dto/create-plans.dto';
import { CreateWorkoutLogDto } from '@/training/workout-logs/dto/create-workout-log.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateWorkoutLogDto extends PartialType(CreateWorkoutLogDto) {}
