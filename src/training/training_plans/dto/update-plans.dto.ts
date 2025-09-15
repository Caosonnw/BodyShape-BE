import { CreateTrainingPlanDto } from '@/training/training_plans/dto/create-plans.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTrainingPlanDto extends PartialType(CreateTrainingPlanDto) {}
