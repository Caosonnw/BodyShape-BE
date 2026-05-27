import { HealthGateway } from '@/gateway/health.gateway';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, PrismaClient, JwtService, HealthGateway],
  exports: [HealthGateway],
})
export class HealthModule {}
