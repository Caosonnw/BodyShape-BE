import { CreatePlanExerciseDto } from '@/training/plan-exercises/dto/create-plan-exercises.dto';
import { UpdatePlanExerciseDto } from '@/training/plan-exercises/dto/update-plan-exercises.dto';
import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PlanExercisesService {
  constructor(private prisma: PrismaClient) {}

  formatPlanExercise(item) {
    const coachUser = item.training_plans.coaches?.users;
    const customerUser = item.training_plans.customers?.users;
    const exercise = item.exercises;
    const plan = item.training_plans;

    return {
      plan_exercise_id: item.planExc_id,
      day_number: item.day_number,
      sets: item.sets,
      reps: item.reps,
      weight: item.weight,
      rest_time: item.rest_time,
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

  async getAllPlanExercises() {
    try {
      const rawData = await this.prisma.training_plan_exercises.findMany({
        include: {
          training_plans: {
            include: {
              coaches: {
                include: {
                  training_plans: {
                    select: { description: true, diet_plan: true },
                  },
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
                  training_plans: {
                    select: { description: true, diet_plan: true },
                  },
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

      if (!rawData || rawData.length === 0) {
        return Response('No plan exercises found.', HttpStatus.NOT_FOUND, null);
      }

      const formatted = rawData.map(this.formatPlanExercise);
      return Response(
        'Plan exercises retrieved successfully.',
        HttpStatus.OK,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to retrieve plan exercises.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async getPlanExerciseById(planExerciseId: number) {
    try {
      const item = await this.prisma.training_plan_exercises.findUnique({
        where: { planExc_id: planExerciseId },
        include: {
          training_plans: {
            include: {
              coaches: {
                include: {
                  training_plans: {
                    select: { description: true, diet_plan: true },
                  },
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
                  training_plans: {
                    select: { description: true, diet_plan: true },
                  },
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

      if (!item) {
        return Response('Plan exercise not found.', HttpStatus.NOT_FOUND, null);
      }

      const formatted = this.formatPlanExercise(item);
      return Response(
        'Plan exercise retrieved successfully.',
        HttpStatus.OK,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to retrieve plan exercise.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async getPlanExercisesByCustomer(customerId: number) {
    try {
      const rawData = await this.prisma.training_plan_exercises.findMany({
        where: { training_plans: { customers: { user_id: customerId } } },
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

      if (!rawData || rawData.length === 0) {
        return Response(
          'No plan exercises found for this customer.',
          HttpStatus.NOT_FOUND,
          null,
        );
      }

      const formatted = rawData.map(this.formatPlanExercise);
      return Response(
        'Plan exercises for customer retrieved successfully.',
        HttpStatus.OK,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to retrieve plan exercises for customer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async createPlanExercise(createPlanExerciseDto: CreatePlanExerciseDto) {
    try {
      const {
        plan_id,
        exercise_id,
        day_number,
        sets,
        reps,
        weight,
        rest_time,
      } = createPlanExerciseDto;

      const newPlanExercise = await this.prisma.training_plan_exercises.create({
        data: {
          plan_id,
          exercise_id,
          day_number,
          sets,
          reps,
          weight,
          rest_time,
        },
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

      const formatted = this.formatPlanExercise(newPlanExercise);
      return Response(
        'Plan exercise created successfully.',
        HttpStatus.CREATED,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to create plan exercise.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async updatePlanExercise(
    planExerciseId: number,
    updatePlanExerciseDto: UpdatePlanExerciseDto,
  ) {
    try {
      const updatedPlanExercise =
        await this.prisma.training_plan_exercises.update({
          where: { planExc_id: planExerciseId },
          data: updatePlanExerciseDto,
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

      const formatted = this.formatPlanExercise(updatedPlanExercise);
      return Response(
        'Plan exercise updated successfully.',
        HttpStatus.OK,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to update plan exercise.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }

  async deletePlanExercise(planExerciseId: number) {
    try {
      const deletedPlanExercise =
        await this.prisma.training_plan_exercises.delete({
          where: { planExc_id: planExerciseId },
        });

      if (!deletedPlanExercise) {
        return Response('Plan exercise not found.', HttpStatus.NOT_FOUND, null);
      }

      return Response(
        'Plan exercise deleted successfully.',
        HttpStatus.OK,
        null,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to delete plan exercise.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message || error,
      );
    }
  }
}
