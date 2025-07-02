import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkoutLogDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the customer',
  })
  @IsNumber()
  customer_id: number;

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
    example: '2023-10-01',
    description: 'Date of the workout in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsOptional()
  workout_date: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Number of sets performed',
  })
  @IsNumber()
  @IsOptional()
  actual_sets: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of repetitions performed',
  })
  @IsNumber()
  @IsOptional()
  actual_reps: number;

  @ApiPropertyOptional({
    example: 60,
    description: 'Weight used for the exercise in kg',
  })
  @IsNumber()
  @IsOptional()
  actual_weight: number;

  @ApiPropertyOptional({
    example: 'Felt great, pushed hard on the last set',
    description: 'Additional notes about the workout',
  })
  @IsString()
  @IsOptional()
  notes: string;
}
