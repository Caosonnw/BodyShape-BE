import { CreateTrainingPlanDto } from '@/training/training_plans/dto/create-plans.dto';
import { UpdateTrainingPlanDto } from '@/training/training_plans/dto/update-plans.dto';
import { Response } from '@/utils/utils';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TrainingPlansService {
  constructor(private prisma: PrismaClient) {}

  async getAllTrainingPlans() {
    try {
      const trainingPlans = await this.prisma.training_plans.findMany({
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
      });

      if (!trainingPlans || trainingPlans.length === 0) {
        return Response('No training plans found.', 404, null);
      }

      return Response(
        'Training plans retrieved successfully.',
        200,
        trainingPlans,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve training plans. Please try again later.',
        500,
        error.message || error,
      );
    }
  }

  async getTrainingPlanById(training_plan_id: number) {
    try {
      const trainingPlan = await this.prisma.training_plans.findUnique({
        where: { plan_id: training_plan_id },
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
      });

      if (!trainingPlan) {
        return Response(
          `Training plan with ID ${training_plan_id} does not exist.`,
          404,
          null,
        );
      }

      return Response(
        'Training plan retrieved successfully.',
        200,
        trainingPlan,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve training plan. Please try again later.',
        500,
        error.message || error,
      );
    }
  }

  async createTrainingPlan(createTrainingPlanDto: CreateTrainingPlanDto) {
    try {
      const { coach_id, customer_id, description, diet_plan } =
        createTrainingPlanDto;

      // Check if the coach exists
      const coach = await this.prisma.coaches.findUnique({
        where: { user_id: coach_id },
      });
      if (!coach) {
        return Response(`Coach with ID ${coach_id} does not exist.`, 404, null);
      }

      // Check if the user exists
      const user = await this.prisma.users.findUnique({
        where: { user_id: customer_id },
      });
      if (!user) {
        return Response(
          `User with ID ${customer_id} does not exist.`,
          404,
          null,
        );
      }

      const response = await this.prisma.training_plans.create({
        data: createTrainingPlanDto,
      });

      return Response('Training plan created successfully.', 201, response);
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to create training plan. Please try again later.',
        500,
        error.message || error,
      );
    }
  }

  async updateTrainingPlan(
    training_plan_id: number,
    updateTrainingPlanDto: UpdateTrainingPlanDto,
  ) {
    try {
      const { coach_id, customer_id, description, diet_plan } =
        updateTrainingPlanDto;

      // Check if the training plan exists
      const trainingPlan = await this.prisma.training_plans.findUnique({
        where: { plan_id: training_plan_id },
      });
      if (!trainingPlan) {
        return Response(
          `Training plan with ID ${training_plan_id} does not exist.`,
          404,
          null,
        );
      }

      // Check if the coach exists
      const coach = await this.prisma.coaches.findUnique({
        where: { user_id: coach_id },
      });
      if (!coach) {
        return Response(`Coach with ID ${coach_id} does not exist.`, 404, null);
      }

      // Check if the user exists
      const user = await this.prisma.users.findUnique({
        where: { user_id: customer_id },
      });
      if (!user) {
        return Response(
          `User with ID ${customer_id} does not exist.`,
          404,
          null,
        );
      }

      const response = await this.prisma.training_plans.update({
        where: { plan_id: training_plan_id },
        data: updateTrainingPlanDto,
      });

      return Response('Training plan updated successfully.', 200, response);
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to update training plan. Please try again later.',
        500,
        error.message || error,
      );
    }
  }

  async deleteTrainingPlan(training_plan_id: number) {
    try {
      const trainingPlan = await this.prisma.training_plans.findUnique({
        where: { plan_id: training_plan_id },
      });
      if (!trainingPlan) {
        return Response(
          `Training plan with ID ${training_plan_id} does not exist.`,
          404,
          null,
        );
      }

      await this.prisma.training_plans.delete({
        where: { plan_id: training_plan_id },
      });

      return Response('Training plan deleted successfully.', 200, null);
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to delete training plan. Please try again later.',
        500,
        error.message || error,
      );
    }
  }
}
