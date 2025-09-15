import { Response } from '@/utils/utils';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CheckinsService {
  constructor(private prisma: PrismaClient) {}

  async getAllCheckins() {
    try {
      const checkins = await this.prisma.checkins.findMany({
        include: {
          users: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              phone_number: true,
              avatar: true,
            },
          },
        },
      });
      return Response('Check-ins retrieved successfully', 200, checkins);
    } catch (error) {
      console.log(error);
      return Response('Failed to retrieve check-ins', 500, error.message);
    }
  }

  async getCheckinByToday() {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const checkins = await this.prisma.checkins.findMany({
        where: {
          checkin_time: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        include: {
          users: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              phone_number: true,
              avatar: true,
            },
          },
        },
      });
      return Response(
        'Check-ins for today retrieved successfully',
        200,
        checkins,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve check-ins for today',
        500,
        error.message,
      );
    }
  }

  async getCheckinByTodayUser(userId: number) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const checkin = await this.prisma.checkins.findFirst({
        where: {
          user_id: userId,
          checkin_time: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        include: {
          users: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              phone_number: true,
              avatar: true,
            },
          },
        },
      });

      if (!checkin) {
        return Response('No check-in found for today', 404, null);
      }
      return Response(
        'Check-in for today retrieved successfully',
        200,
        checkin,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve check-in for today',
        500,
        error.message,
      );
    }
  }

  async getCheckinByUser(userId: number) {
    try {
      const checkins = await this.prisma.checkins.findMany({
        where: { user_id: userId },
        include: {
          users: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              phone_number: true,
              avatar: true,
            },
          },
        },
        orderBy: { checkin_time: 'desc' },
      });
      return Response('Check-ins retrieved successfully', 200, checkins);
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to retrieve check-ins for user',
        500,
        error.message,
      );
    }
  }

  // Checkin - tạo mới 1 record nếu hôm nay chưa checkin
  async createCheckin(userId: number) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Kiểm tra nếu hôm nay đã check-in
      const existing = await this.prisma.checkins.findFirst({
        where: {
          user_id: userId,
          checkin_time: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      if (existing) {
        return Response('Already checked in today', 400, null);
      }

      const checkin = await this.prisma.checkins.create({
        data: {
          user_id: userId,
          checkin_time: new Date(),
        },
      });

      return Response('Check-in created successfully', 201, checkin);
    } catch (error) {
      console.error(error);
      return Response('Failed to create check-in', 500, error.message);
    }
  }

  // Checkout - cập nhật record checkin hôm nay
  async createCheckout(userId: number) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Tìm bản ghi checkin hôm nay
      const checkin = await this.prisma.checkins.findFirst({
        where: {
          user_id: userId,
          checkin_time: {
            gte: todayStart,
            lte: todayEnd,
          },
          checkout_time: null, // chưa checkout mới cho phép checkout
        },
      });

      if (!checkin) {
        return Response(
          'No check-in found for today or already checked out',
          400,
          null,
        );
      }

      const updated = await this.prisma.checkins.update({
        where: {
          checkin_id: checkin.checkin_id,
        },
        data: {
          checkout_time: new Date(),
        },
      });

      return Response('Check-out successful', 200, updated);
    } catch (error) {
      console.error(error);
      return Response('Failed to create check-out', 500, error.message);
    }
  }
}
