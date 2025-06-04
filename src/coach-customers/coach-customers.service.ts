import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CoachCustomersService {
  constructor(private prisma: PrismaClient) {}

  async getCoachCustomers(user_id: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { user_id },
        select: { role: true },
      });

      if (!user) {
        return Response('User not found!', HttpStatus.NOT_FOUND);
      }

      if (user.role === 'COACH') {
        const customers = await this.prisma.coach_customers.findMany({
          where: { coach_id: user_id },
          include: {
            customers: {
              include: {
                users: {
                  select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    phone_number: true,
                    gender: true,
                    date_of_birth: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        const result = customers.map((cc) => ({
          user_id: cc.customer_id,
          full_name: cc.customers?.users?.full_name,
          email: cc.customers?.users?.email,
          phone_number: cc.customers?.users?.phone_number,
          gender: cc.customers?.users?.gender,
          date_of_birth: cc.customers?.users?.date_of_birth,
          avatar: cc.customers?.users?.avatar,
        }));

        return Response(
          'Get coach customers successfully!',
          HttpStatus.OK,
          result,
        );
      } else if (user.role === 'CUSTOMER') {
        const coaches = await this.prisma.coach_customers.findMany({
          where: { customer_id: user_id },
          include: {
            coaches: {
              include: {
                users: {
                  select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    phone_number: true,
                    gender: true,
                    date_of_birth: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        const result = coaches.map((cc) => ({
          user_id: cc.coach_id,
          full_name: cc.coaches?.users?.full_name,
          email: cc.coaches?.users?.email,
          phone_number: cc.coaches?.users?.phone_number,
          gender: cc.coaches?.users?.gender,
          date_of_birth: cc.coaches?.users?.date_of_birth,
          avatar: cc.coaches?.users?.avatar,
        }));

        return Response(
          'Get customer coaches successfully!',
          HttpStatus.OK,
          result,
        );
      } else {
        return Response(
          'User role does not support this operation',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(error);
      return Response(
        'An error occurred while fetching related users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
