import { Module } from '@nestjs/common';
import { TrainingPlansService } from './training_plans.service';
import { TrainingPlansController } from './training_plans.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [TrainingPlansController],
  providers: [TrainingPlansService, PrismaClient, JwtService],
})
export class TrainingPlansModule {}
