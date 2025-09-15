import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, PrismaClient, JwtService],
})
export class SchedulesModule {}
