import { CreateTrainingScheduleDto } from '@/schedules/dto/create-schedule.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTrainingScheduleDto extends PartialType(
  CreateTrainingScheduleDto,
) {}
