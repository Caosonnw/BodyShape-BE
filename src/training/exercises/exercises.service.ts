import { CreateExerciseDto } from '@/training/exercises/dto/create-exercises.dto';
import { Response } from '@/utils/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaClient) {}

  async getAllExercises() {
    try {
      const exercises = await this.prisma.exercises.findMany({
        orderBy: { exercise_id: 'asc' },
      });
      return Response(
        'Exercises retrieved successfully',
        HttpStatus.OK,
        exercises,
      );
    } catch (error) {
      return Response(
        'Failed to retrieve exercises',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async getExerciseById(exercise_id: number) {
    try {
      const exercise = await this.prisma.exercises.findUnique({
        where: { exercise_id },
      });
      if (!exercise) {
        return Response('Exercise not found', HttpStatus.NOT_FOUND, null);
      }
      return Response(
        'Exercise retrieved successfully',
        HttpStatus.OK,
        exercise,
      );
    } catch (error) {
      return Response(
        'Failed to retrieve exercise',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async createExercise(dto: CreateExerciseDto) {
    try {
      const {
        exercise_name,
        description,
        muscle_group,
        equipment_needed,
        video_url,
      } = dto;

      // Optional: guard against duplicate names
      const existed = await this.prisma.exercises.findFirst({
        where: { exercise_name },
      });
      if (existed) {
        throw new HttpException(
          'Exercise name already exists',
          HttpStatus.CONFLICT,
        );
      }

      const created = await this.prisma.exercises.create({
        data: {
          exercise_name,
          description,
          muscle_group,
          equipment_needed,
          video_url,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return Response(
        'Exercise created successfully',
        HttpStatus.CREATED,
        created,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      return Response(
        'Failed to create exercise',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async updateExercise(exercise_id: number, dto: CreateExerciseDto) {
    try {
      const existed = await this.prisma.exercises.findUnique({
        where: { exercise_id },
      });
      if (!existed) {
        return Response('Exercise not found', HttpStatus.NOT_FOUND, null);
      }

      const {
        exercise_name,
        description,
        muscle_group,
        equipment_needed,
        video_url,
      } = dto;

      const updated = await this.prisma.exercises.update({
        where: { exercise_id },
        data: {
          exercise_name,
          description,
          muscle_group,
          equipment_needed,
          video_url,
          updated_at: new Date(),
        },
      });
      return Response('Exercise updated successfully', HttpStatus.OK, updated);
    } catch (error) {
      return Response(
        'Failed to update exercise',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async deleteExercise(exercise_id: number) {
    try {
      // Ensure no workout_logs or training_plan_exercises still reference this exercise
      const deps = await this.prisma.workout_logs.count({
        where: { exercise_id },
      });
      const depsPlan = await this.prisma.training_plan_exercises.count({
        where: { exercise_id },
      });
      if (deps > 0 || depsPlan > 0) {
        throw new HttpException(
          'Exercise is referenced by other records',
          HttpStatus.CONFLICT,
        );
      }

      const deleted = await this.prisma.exercises.delete({
        where: { exercise_id },
      });
      return Response('Exercise deleted successfully', HttpStatus.OK, deleted);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      return Response(
        'Failed to delete exercise',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async uploadVideo(photo_url: string) {
    try {
      if (!photo_url) {
        throw new HttpException(
          'No photo URL provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      return Response(
        'Upload video successfully!',
        HttpStatus.CREATED,
        photo_url,
      );
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new HttpException(
        'An error occurred during the upload process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
