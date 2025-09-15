import { AuthModule } from '@/auth/auth.module';
import { ChatGateway } from '@/gateway/chat.gateway';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [ChatService, PrismaClient, JwtService, ChatGateway],
})
export class ChatModule {}
