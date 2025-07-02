import { CreateExerciseDto } from '@/training/exercises/dto/create-exercises.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
