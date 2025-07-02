import { CreateExerciseDto } from '@/training/exercises/dto/create-exercises.dto';
import { Response } from '@/utils/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaClient) {}

  async getAllExercises() {
    try {
      const exercises = await this.prisma.exercises.findMany();
      return Response('Exercises retrieved successfully', 200, exercises);
    } catch (error) {
      console.log(error);
      return Response('Failed to retrieve exercises', 500, error.message);
    }
  }

  async getExerciseById(exercise_id: number) {
    try {
      const exercise = await this.prisma.exercises.findUnique({
        where: { exercise_id },
      });
      if (!exercise) {
        return Response('Exercise not found', 404, null);
      }
      return Response('Exercise retrieved successfully', 200, exercise);
    } catch (error) {
      console.log(error);
      return Response('Failed to retrieve exercise', 500, error.message);
    }
  }

  async createExercise(createExerciseDto: CreateExerciseDto) {
    try {
      const {
        exercise_name,
        description,
        muscle_group,
        equipment_needed,
        video_url,
      } = createExerciseDto;

      const result = await this.prisma.exercises.create({
        data: {
          exercise_name,
          description,
          muscle_group,
          equipment_needed,
          video_url,
          created_at: new Date().toISOString(),
        },
      });

      return Response('Exercise created successfully', 201, result);
    } catch (error) {
      console.log(error);
      return Response('Failed to create exercise', 500, error.message);
    }
  }

  async updateExercise(
    createExerciseDto: CreateExerciseDto,
    exercise_id: number,
  ) {
    try {
      const {
        exercise_name,
        description,
        muscle_group,
        equipment_needed,
        video_url,
      } = createExerciseDto;

      const result = await this.prisma.exercises.update({
        where: { exercise_id },
        data: {
          exercise_name,
          description,
          muscle_group,
          equipment_needed,
          video_url,
          updated_at: new Date().toISOString(),
        },
      });

      return Response('Exercise updated successfully', 200, result);
    } catch (error) {
      console.log(error);
      return Response('Failed to update exercise', 500, error.message);
    }
  }

  async deleteExercise(exercise_id: number) {
    try {
      const result = await this.prisma.exercises.delete({
        where: { exercise_id },
      });
      return Response('Exercise deleted successfully', 200, result);
    } catch (error) {
      console.log(error);
      return Response('Failed to delete exercise', 500, error.message);
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
