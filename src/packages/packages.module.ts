import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, PrismaClient, JwtService],
})
export class PackagesModule {}
