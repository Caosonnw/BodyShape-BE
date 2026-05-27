// chat.controller.ts

import { Response } from '@/utils/utils';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // =========================================================
  // CHAT AI
  // =========================================================
  @Post('chat-with-ai')
  async getMessage(@Body('prompt') prompt: string) {
    try {
      const completion = await this.chatService.getChatAIResponse(prompt);

      return Response(
        'Successfully fetched AI response',
        HttpStatus.OK,
        completion,
      );
    } catch (error) {
      return Response(
        'Error fetching AI response',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  // =========================================================
  // GET MY CONVERSATIONS
  // =========================================================
  @Get('conversations')
  async getConversations(@Req() req: any) {
    const data = await this.chatService.getMyConversations(req.user.user_id);

    return Response('Get conversations successfully', HttpStatus.OK, data);
  }

  // =========================================================
  // GET MESSAGES
  // =========================================================
  @Get(':conversationId/messages')
  async getMessages(
    @Req() req: any,
    @Param('conversationId', ParseIntPipe)
    conversationId: number,
  ) {
    const data = await this.chatService.getMessages(
      conversationId,
      req.user.user_id,
    );

    return Response('Get messages successfully', HttpStatus.OK, data);
  }

  // =========================================================
  // SEND MESSAGE (REST FALLBACK)
  // =========================================================
  @Post('send')
  async sendMessage(
    @Req() req: any,
    @Body()
    body: {
      receiverId: number;
      content: string;
    },
  ) {
    const data = await this.chatService.createMessage(
      req.user.user_id,
      body.receiverId,
      body.content,
    );

    return Response('Send message successfully', HttpStatus.CREATED, data);
  }

  // =========================================================
  // MARK AS SEEN
  // =========================================================
  @Post('seen')
  async markSeen(
    @Req() req: any,
    @Body()
    body: {
      conversationId: number;
      messageId: number;
    },
  ) {
    const data = await this.chatService.markAsSeen(
      body.conversationId,
      req.user.user_id,
      body.messageId,
    );

    return Response('Seen message successfully', HttpStatus.OK, data);
  }

  // =========================================================
  // GET / CREATE CONVERSATION BY USER
  // =========================================================
  @Post('conversation')
  async getOrCreateConversation(
    @Req() req: any,
    @Body()
    body: {
      targetUserId: number;
    },
  ) {
    const data = await this.chatService.getOrCreateConversation(
      req.user.user_id,
      body.targetUserId,
    );

    return Response('Get conversation successfully', HttpStatus.OK, data);
  }
}
