import { CreateTrainingScheduleDto } from '@/schedules/dto/create-schedule.dto';
import { UpdateTrainingScheduleDto } from '@/schedules/dto/update-schedule.dto';
import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaClient) {}

  async getUserRole(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      select: { role: true },
    });

    return user?.role || null;
  }

  async getSchedules(userId: number, customerId?: number) {
    try {
      const role = await this.getUserRole(userId);

      let whereClause: any = {};

      if (role === 'COACH') {
        whereClause.coach_id = userId;
      } else if (role === 'CUSTOMER') {
        whereClause.customer_id = userId;
      }

      const schedules = await this.prisma.training_schedules.findMany({
        where: whereClause,
        include: {
          customers: {
            include: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      return Response(
        'Schedules retrieved successfully',
        HttpStatus.OK,
        schedules,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error retrieving schedules: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSchedules(userId: number, body: CreateTrainingScheduleDto) {
    try {
      const schedule = await this.prisma.training_schedules.create({
        data: {
          coach_id: userId,
          customer_id: body.customer_id,
          title: body.title,
          description: body.description,
          start_date: new Date(body.start_date),
          end_date: new Date(body.end_date),
          color: body.color,
        },
      });
      return Response(
        'Schedule created successfully',
        HttpStatus.CREATED,
        schedule,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Error creating schedule: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSchedules(
    userId: number,
    scheduleId: string,
    body: UpdateTrainingScheduleDto,
  ) {
    try {
      const schedule = await this.prisma.training_schedules.update({
        where: { schedule_id: Number(scheduleId) },
        data: {
          coach_id: userId,
          customer_id: body.customer_id,
          title: body.title,
          start_date: new Date(body.start_date),
          end_date: new Date(body.end_date),
          description: body.description,
          color: body.color,
        },
      });
      return Response('Schedule updated successfully', HttpStatus.OK, schedule);
    } catch (error) {
      console.log(error);
      return Response(
        'Error updating schedule: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
