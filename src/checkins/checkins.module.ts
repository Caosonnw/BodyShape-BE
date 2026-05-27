import { CheckinsGateway } from '@/gateway/checkins.gateway';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';

@Module({
  controllers: [CheckinsController],
  providers: [CheckinsService, PrismaClient, JwtService, CheckinsGateway],
})
export class CheckinsModule {}
