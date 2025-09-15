import { AuthModule } from '@/auth/auth.module';
import { PresenceGateway } from '@/gateway/presence.gateway';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [AuthModule],
  controllers: [PresenceController],
  providers: [PresenceService, PrismaClient, JwtService, PresenceGateway],
})
export class PresenceModule {}
