import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/ jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtStrategy } from 'src/auth/guards/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
