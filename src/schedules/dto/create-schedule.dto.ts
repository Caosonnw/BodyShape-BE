import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTrainingScheduleDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsInt()
  coach_id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  start_time?: string;

  @IsOptional()
  @IsDateString()
  end_time?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
