import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService, PrismaClient, JwtService],
})
export class ExercisesModule {}
