import { CreatePlanExerciseDto } from '@/training/plan-exercises/dto/create-plan-exercises.dto';
import { CreateTrainingPlanDto } from '@/training/training_plans/dto/create-plans.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePlanExerciseDto extends PartialType(CreatePlanExerciseDto) {}
