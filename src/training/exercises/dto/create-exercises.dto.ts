import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ExerciseType {
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  FLEXIBILITY = 'FLEXIBILITY',
  BALANCE = 'BALANCE',
}

export class CreateExerciseDto {
  @ApiPropertyOptional({
    example: 'Bench Press',
    description: 'Name of the exercise',
  })
  @IsOptional()
  @IsString()
  exercise_name?: string;

  @ApiPropertyOptional({
    example:
      'A compound exercise that targets the chest, shoulders, and triceps.',
    description: 'Detailed description of the exercise',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ExerciseType.STRENGTH,
    enum: ExerciseType,
    description: 'Type of the exercise',
  })
  @IsOptional()
  @IsEnum(ExerciseType)
  muscle_group?: ExerciseType;

  @ApiPropertyOptional({
    example: 'Barbell',
    description: 'Equipment needed for the exercise',
  })
  @IsOptional()
  @IsString()
  equipment_needed?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/video.mp4',
    description: 'URL of the video demonstrating the exercise',
  })
  @IsOptional()
  @IsString()
  video_url?: string;
}
