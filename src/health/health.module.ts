import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { HealthGateway } from '@/gateway/health.gateway';

@Module({
  controllers: [HealthController],
  providers: [HealthService, PrismaClient, JwtService, HealthGateway],
  exports: [HealthGateway],
})
export class HealthModule {}
