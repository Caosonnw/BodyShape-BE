import { Module } from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import { WorkoutLogsController } from './workout-logs.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [WorkoutLogsController],
  providers: [WorkoutLogsService, PrismaClient, JwtService],
})
export class WorkoutLogsModule {}
