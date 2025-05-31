import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CoachCustomersController } from './coach-customers.controller';
import { CoachCustomersService } from './coach-customers.service';

@Module({
  controllers: [CoachCustomersController],
  providers: [CoachCustomersService, PrismaClient, JwtService],
})
export class CoachCustomersModule {}
