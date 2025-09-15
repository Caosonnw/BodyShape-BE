import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaClient) {}

  async getHealthFromHealthKit(userId: number, healthData) {
    console.log('✅ healthData nhận được:', healthData);

    const user = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });
    if (!user) {
      return Response('User not found!', HttpStatus.NOT_FOUND);
    }

    if (!healthData) {
      return Response('Health data not found!', HttpStatus.BAD_REQUEST);
    }

    try {
      // Kiểm tra xem user đã có record health chưa (giả sử mỗi user chỉ có 1 bản ghi health)
      const existingHealth = await this.prisma.healths.findFirst({
        where: { user_id: userId },
      });

      let health;

      if (existingHealth) {
        // Update bản ghi hiện tại
        health = await this.prisma.healths.update({
          where: { health_id: existingHealth.health_id },
          data: {
            weight: healthData.weight,
            height: healthData.height,
            step: healthData.steps,
            heartRate: healthData.heartRate,
            standHours: healthData.standHours,
            exerciseTime: healthData.exerciseTime,
            activeEnergy: healthData.activeEnergy,
            // sleep: healthData.sleep,
            // ...
          },
        });
      } else {
        // Tạo mới nếu chưa có bản ghi
        health = await this.prisma.healths.create({
          data: {
            user_id: userId,
            weight: healthData.weight,
            height: healthData.height,
            step: healthData.steps,
            heartRate: healthData.heart_rate,
            standHours: healthData.stand_hours,
            exerciseTime: healthData.exercise_time,
            activeEnergy: healthData.active_energy,
          },
        });
      }

      return Response(
        'Health record saved successfully!',
        HttpStatus.OK,
        health,
      );
    } catch (error) {
      console.error('Error saving health record:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving health record',
      };
    }
  }

  async getHealthByUserId(userId: number) {
    const user = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });
    if (!user) {
      return Response('User not found!', HttpStatus.NOT_FOUND);
    }
    try {
      const health = await this.prisma.healths.findFirst({
        where: { user_id: userId },
      });
      if (!health) {
        return Response('Health record not found!', HttpStatus.NOT_FOUND);
      }
      return Response('Get health record successfully!', HttpStatus.OK, health);
    } catch (error) {
      console.error('Error fetching health record:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching health record',
      };
    }
  }
}
