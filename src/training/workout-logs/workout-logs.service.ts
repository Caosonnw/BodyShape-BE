import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class WorkoutLogsService {
  constructor(private prisma: PrismaClient) {}

  formatWorkoutLogs(item) {
    const coachUser = item.training_plans.coaches?.users;
    const customerUser = item.training_plans.customers?.users;
    const exercise = item.exercises;
    const plan = item.training_plans;

    return {
      log_id: item.log_id,
      actual_sets: item.actual_sets,
      actual_reps: item.actual_reps,
      actual_weight: item.actual_weight,
      notes: item.notes,
      workout_date: item.workout_date,
      training_plans: plan
        ? {
            plan_id: plan.plan_id,
            description: plan.description,
            diet_plan: plan.diet_plan,
          }
        : null,
      exercise: {
        exercise_id: exercise.exercise_id,
        name: exercise.exercise_name,
        description: exercise.description,
        muscleGroup: exercise.muscle_group,
        equipment: exercise.equipment_needed,
        videoUrl: exercise.video_url,
      },
      coaches: coachUser
        ? {
            coach_id: coachUser.user_id,
            full_name: coachUser.full_name,
            email: coachUser.email,
            date_of_birth: coachUser.date_of_birth,
            phone_number: coachUser.phone_number,
            avatar: coachUser.avatar,
          }
        : null,
      customer: customerUser
        ? {
            customer_id: customerUser.user_id,
            full_name: customerUser.full_name,
            email: customerUser.email,
            date_of_birth: customerUser.date_of_birth,
            phone_number: customerUser.phone_number,
            avatar: customerUser.avatar,
          }
        : null,
    };
  }

  async getAllWorkoutLogs() {
    try {
      const rawData = await this.prisma.workout_logs.findMany({
        include: {
          training_plans: {
            include: {
              coaches: {
                include: {
                  users: {
                    select: {
                      user_id: true,
                      full_name: true,
                      email: true,
                      date_of_birth: true,
                      phone_number: true,
                      avatar: true,
                    },
                  },
                },
              },
              customers: {
                include: {
                  users: {
                    select: {
                      user_id: true,
                      full_name: true,
                      email: true,
                      date_of_birth: true,
                      phone_number: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
          exercises: {
            select: {
              exercise_id: true,
              exercise_name: true,
              description: true,
              muscle_group: true,
              equipment_needed: true,
              video_url: true,
            },
          },
        },
      });
      const formattedLogs = rawData.map((item) => this.formatWorkoutLogs(item));
      return Response(
        'Workout logs fetched successfully',
        HttpStatus.OK,
        formattedLogs,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error fetching workout logs',
        error.message || 'An error occurred while fetching workout logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWorkoutLogsById(log_id: number) {
    try {
      const response = await this.prisma.workout_logs.findUnique({
        where: { log_id },
        include: {
          training_plans: {
            include: {
              coaches: {
                include: {
                  users: {
                    select: {
                      user_id: true,
                      full_name: true,
                      email: true,
                      date_of_birth: true,
                      phone_number: true,
                      avatar: true,
                    },
                  },
                },
              },
              customers: {
                include: {
                  users: {
                    select: {
                      user_id: true,
                      full_name: true,
                      email: true,
                      date_of_birth: true,
                      phone_number: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
          exercises: {
            select: {
              exercise_id: true,
              exercise_name: true,
              description: true,
              muscle_group: true,
              equipment_needed: true,
              video_url: true,
            },
          },
        },
      });
      if (!response) {
        return Response('Workout log not found', HttpStatus.NOT_FOUND, null);
      }
      const formattedLog = this.formatWorkoutLogs(response);
      return Response(
        'Workout log fetched successfully',
        HttpStatus.OK,
        formattedLog,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error fetching workout log',
        error.message || 'An error occurred while fetching the workout log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createWorkoutLog(createWorkoutLogDto) {
    try {
      const newLog = await this.prisma.workout_logs.create({
        data: createWorkoutLogDto,
      });
      return Response(
        'Workout log created successfully',
        HttpStatus.CREATED,
        newLog,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error creating workout log',
        error.message || 'An error occurred while creating the workout log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateWorkoutLog(log_id: number, updateWorkoutLogDto) {
    try {
      const updatedLog = await this.prisma.workout_logs.update({
        where: { log_id },
        data: updateWorkoutLogDto,
      });
      return Response(
        'Workout log updated successfully',
        HttpStatus.OK,
        updatedLog,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error updating workout log',
        error.message || 'An error occurred while updating the workout log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteWorkoutLog(log_id: number) {
    try {
      const deletedLog = await this.prisma.workout_logs.delete({
        where: { log_id },
      });
      return Response(
        'Workout log deleted successfully',
        HttpStatus.OK,
        deletedLog,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error deleting workout log',
        error.message || 'An error occurred while deleting the workout log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
