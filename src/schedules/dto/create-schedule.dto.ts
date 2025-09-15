import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTrainingScheduleDto {
  @ApiPropertyOptional({ example: 1, description: 'Customer ID' })
  @IsOptional()
  @IsInt()
  customer_id?: number;

  // @ApiPropertyOptional({ example: 2, description: 'Coach ID' })
  // @IsOptional()
  // @IsInt()
  // coach_id?: number;

  @ApiPropertyOptional({
    example: 'Morning Workout',
    description: 'Schedule Title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: '2025-06-01T08:00:00.000Z',
    description: 'Start Date',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    example: '2025-06-03T08:30:00.000Z',
    description: 'End Date',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    example: 'Morning workout session for customer',
    description: 'Description of the schedule',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Red',
    description: 'Status of the schedule',
  })
  @IsOptional()
  @IsString()
  color?: string;
}
