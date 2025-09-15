import { Module } from '@nestjs/common';
import { PlanExercisesService } from './plan-exercises.service';
import { PlanExercisesController } from './plan-exercises.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PlanExercisesController],
  providers: [PlanExercisesService, PrismaClient, JwtService],
})
export class PlanExercisesModule {}
