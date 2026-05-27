import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaClient) {}

  async getHealthFromHealthKit(userId: number, healthData) {
    // console.log('healthData nhận được:', healthData);

    const user = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });
    if (!user) {
      return Response('User not found!', HttpStatus.NOT_FOUND);
    }

    if (!healthData) {
      return Response('Health data not found!', HttpStatus.BAD_REQUEST);
    }

    // Bóc payload: chấp nhận { healthData: {...} } hoặc {...}
    const payload = healthData?.healthData ?? healthData;
    if (!payload || typeof payload !== 'object') {
      return Response('Health data not found!', HttpStatus.BAD_REQUEST);
    }

    // 3) Chỉ map những field có thật trong payload
    //    Lưu ý: 0 là giá trị hợp lệ, nên phải kiểm bằng 'in' thay vì truthy.
    const mappedData: Record<string, any> = {};
    if ('weight' in payload) mappedData.weight = payload.weight;
    if ('height' in payload) mappedData.height = payload.height;
    if ('steps' in payload) mappedData.step = payload.steps; // DB dùng 'step'
    if ('heartRate' in payload) mappedData.heartRate = payload.heartRate;
    if ('standHours' in payload) mappedData.standHours = payload.standHours;
    if ('exerciseTime' in payload)
      mappedData.exerciseTime = payload.exerciseTime;
    if ('activeEnergy' in payload)
      mappedData.activeEnergy = payload.activeEnergy;

    // (tuỳ chọn) ép kiểu số an toàn
    for (const k of Object.keys(mappedData)) {
      const v = mappedData[k];
      if (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))) {
        mappedData[k] = Number(v);
      }
    }

    try {
      // Kiểm tra xem user đã có record health chưa (giả sử mỗi user chỉ có 1 bản ghi health)
      const existingHealth = await this.prisma.healths.findFirst({
        where: { user_id: userId },
      });

      let health;

      const mappedData = {
        weight: payload.weight,
        height: payload.height,
        step: payload.steps,
        heartRate: payload.heartRate,
        standHours: payload.standHours,
        exerciseTime: payload.exerciseTime,
        activeEnergy: payload.activeEnergy,
      };

      if (existingHealth) {
        // Update bản ghi hiện tại
        health = await this.prisma.healths.update({
          where: { health_id: existingHealth.health_id },
          data: mappedData,
        });
      } else {
        // Tạo mới nếu chưa có bản ghi
        health = await this.prisma.healths.create({
          data: {
            user_id: userId,
            ...mappedData,
          },
        });
      }
      // console.log(health);

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
