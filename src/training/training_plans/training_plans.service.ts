import { CreateTrainingPlanDto } from '@/training/training_plans/dto/create-plans.dto';
import { UpdateTrainingPlanDto } from '@/training/training_plans/dto/update-plans.dto';
import { Response } from '@/utils/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TrainingPlansService {
  constructor(private prisma: PrismaClient) {}

  private coachInclude() {
    return {
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
    };
  }

  private customerInclude() {
    return {
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
    };
  }

  async getAllTrainingPlans() {
    try {
      const trainingPlans = await this.prisma.training_plans.findMany({
        orderBy: { plan_id: 'asc' },
        include: {
          coaches: this.coachInclude(),
          customers: this.customerInclude(),
          training_plan_exercises: {
            include: {
              exercises: true,
            },
          },
        },
      });
      if (!trainingPlans || trainingPlans.length === 0) {
        return Response('No training plans found.', HttpStatus.NOT_FOUND, null);
      }

      return Response(
        'Training plans retrieved successfully.',
        HttpStatus.OK,
        trainingPlans,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve training plans',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async getTrainingPlanById(training_plan_id: number) {
    try {
      const trainingPlan = await this.prisma.training_plans.findUnique({
        where: { plan_id: training_plan_id },
        include: {
          coaches: this.coachInclude(),
          customers: this.customerInclude(),
          training_plan_exercises: {
            include: { exercises: true },
          },
        },
      });

      if (!trainingPlan)
        return Response(
          `Training plan with ID ${training_plan_id} does not exist.`,
          HttpStatus.NOT_FOUND,
          null,
        );

      return Response(
        'Training plan retrieved successfully.',
        HttpStatus.OK,
        trainingPlan,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve training plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async createTrainingPlan(createTrainingPlanDto: CreateTrainingPlanDto) {
    try {
      const { coach_id, customer_id } = createTrainingPlanDto;

      // Ensure coach & customer exist (their user rows are in coaches/customers table)
      const coach = await this.prisma.coaches.findUnique({
        where: { user_id: coach_id },
      });
      if (!coach)
        throw new HttpException(
          `Coach with ID ${coach_id} not found`,
          HttpStatus.BAD_REQUEST,
        );

      const customer = await this.prisma.customers.findUnique({
        where: { user_id: customer_id },
      });
      if (!customer)
        throw new HttpException(
          `Customer with ID ${customer_id} not found`,
          HttpStatus.BAD_REQUEST,
        );

      const created = await this.prisma.training_plans.create({
        data: createTrainingPlanDto,
      });

      return Response(
        'Training plan created successfully.',
        HttpStatus.CREATED,
        created,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to create training plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async updateTrainingPlan(
    training_plan_id: number,
    updateTrainingPlanDto: UpdateTrainingPlanDto,
  ) {
    try {
      const existed = await this.prisma.training_plans.findUnique({
        where: { plan_id: training_plan_id },
      });
      if (!existed)
        return Response('Training plan not found', HttpStatus.NOT_FOUND, null);

      const { coach_id, customer_id } = updateTrainingPlanDto;

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

      const updated = await this.prisma.training_plans.update({
        where: { plan_id: training_plan_id },
        data: updateTrainingPlanDto,
      });

      return Response(
        'Training plan updated successfully.',
        HttpStatus.OK,
        updated,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to update training plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async deleteTrainingPlan(training_plan_id: number) {
    try {
      // Block delete if dependent rows exist (workout_logs or training_plan_exercises)
      const deps1 = await this.prisma.training_plan_exercises.count({
        where: { plan_id: training_plan_id },
      });
      const deps2 = await this.prisma.workout_logs.count({
        where: { plan_id: training_plan_id },
      });
      if (deps1 > 0 || deps2 > 0) {
        throw new HttpException(
          'Plan is referenced by exercises or workout logs',
          HttpStatus.CONFLICT,
        );
      }

      await this.prisma.training_plans.delete({
        where: { plan_id: training_plan_id },
      });
      return Response(
        'Training plan deleted successfully',
        HttpStatus.OK,
        null,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to delete training plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }
}
