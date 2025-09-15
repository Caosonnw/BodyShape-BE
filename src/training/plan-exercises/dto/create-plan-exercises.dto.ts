import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanExerciseDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the training plan',
  })
  @IsNumber()
  plan_id: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the exercise',
  })
  @IsNumber()
  exercise_id: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Day number of the exercise in the training plan',
  })
  @IsNumber()
  @IsOptional()
  day_number: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Number of sets for the exercise',
  })
  @IsNumber()
  @IsOptional()
  sets: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of repetitions for the exercise',
  })
  @IsNumber()
  @IsOptional()
  reps: number;
  @ApiPropertyOptional({
    example: 60,
    description: 'Weight to be used for the exercise in kg',
  })
  @IsNumber()
  @IsOptional()
  weight: number;

  @ApiPropertyOptional({
    example: 30,
    description: 'Rest time between sets in seconds',
  })
  @IsNumber()
  @IsOptional()
  rest_time: number;
}
