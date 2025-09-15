import { Module } from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { EquipmentsController } from './equipments.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EquipmentsController],
  providers: [EquipmentsService, PrismaClient, JwtService],
})
export class EquipmentsModule {}
