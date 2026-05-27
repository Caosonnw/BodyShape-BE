import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '@/auth/guards/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { RolesGuard } from './guards/roles/roles.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient, JwtAuthGuard, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
