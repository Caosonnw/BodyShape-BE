import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTrainingPlanDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the coach ',
  })
  @IsNumber()
  coach_id: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the customer ',
  })
  @IsNumber()
  customer_id: number;

  @ApiPropertyOptional({
    example: 'Description of the training plan',
    description: 'Description of the training plan',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Standard diet plan',
    description: 'Description of the diet plan',
  })
  @IsOptional()
  @IsDateString()
  diet_plan?: string;
}
