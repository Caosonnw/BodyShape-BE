import { Module } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CheckinsController } from './checkins.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CheckinsController],
  providers: [CheckinsService, PrismaClient, JwtService],
})
export class CheckinsModule {}
