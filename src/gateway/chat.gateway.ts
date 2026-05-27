// chat.gateway.ts

import { ChatService } from '@/chat/chat.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8081, {
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  io: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  // =========================================================
  // INIT — JWT middleware
  // =========================================================
  afterInit(server: Server) {
    const secret = this.cfg.get<string>('JWT_SECRET');

    server.use((socket, next) => {
      try {
        const raw =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization
            ?.toString()
            .replace('Bearer ', '');

        if (!raw) return next(new Error('Missing token'));

        const payload = this.jwt.verify(raw, { secret });
        const uid = Number(payload.sub ?? payload.user_id);

        if (!uid || Number.isNaN(uid))
          return next(new Error('Invalid token payload'));

        socket.data.user = { user_id: uid, role: payload.role };
        next();
      } catch (e: any) {
        return next(new Error(e?.message || 'Unauthorized'));
      }
    });

    this.logger.log('🚀 Chat Gateway Ready');
  }

  // =========================================================
  // CONNECT
  // =========================================================
  async handleConnection(client: Socket) {
    const userId = client.data.user.user_id;
    this.logger.log(`✅ User connected: ${userId} (${client.id})`);

    // Personal room for targeted emits
    client.join(`user:${userId}`);

    // Auto-join all existing conversation rooms
    const conversations = await this.chatService.getMyConversations(userId);
    for (const conversation of conversations) {
      client.join(`conversation:${conversation.conversation_id}`);
    }

    // Broadcast online status
    this.io.emit('user:online', { userId });
  }

  // =========================================================
  // DISCONNECT
  // =========================================================
  async handleDisconnect(client: Socket) {
    const userId = client.data.user.user_id;
    this.logger.log(`❌ User disconnected: ${userId} (${client.id})`);

    this.io.emit('user:offline', { userId });
  }

  // =========================================================
  // SEND MESSAGE
  // =========================================================
  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { receiverId: number; content: string },
  ) {
    try {
      const senderId = client.data.user.user_id;

      const result = await this.chatService.createMessage(
        senderId,
        body.receiverId,
        body.content,
      );

      const { conversation, message } = result;

      // FIX: emit a consistent payload shape that the frontend expects:
      // { conversationId, message, conversation }
      const payload = {
        conversationId: conversation.conversation_id,
        message,
        conversation,
      };

      // Emit to everyone in the conversation room (sender + receiver)
      this.io
        .to(`conversation:${conversation.conversation_id}`)
        .emit('message:new', payload);

      // Also notify receiver's personal room in case they haven't joined the room yet
      this.io.to(`user:${body.receiverId}`).emit('message:new', payload);

      return payload;
    } catch (error: any) {
      this.logger.error('handleSendMessage error:', error);
      return { error: error.message };
    }
  }

  // =========================================================
  // JOIN CONVERSATION
  // =========================================================
  @SubscribeMessage('conversation:join')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { conversationId: number },
  ) {
    client.join(`conversation:${body.conversationId}`);
    this.logger.log(
      `User ${client.data.user.user_id} joined conversation:${body.conversationId}`,
    );

    return { joined: body.conversationId };
  }

  // =========================================================
  // LEAVE CONVERSATION
  // =========================================================
  @SubscribeMessage('conversation:leave')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { conversationId: number },
  ) {
    client.leave(`conversation:${body.conversationId}`);

    return { left: body.conversationId };
  }

  // =========================================================
  // MARK AS SEEN
  // =========================================================
  @SubscribeMessage('message:seen')
  async handleSeenMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { conversationId: number; messageId: number },
  ) {
    const userId = client.data.user.user_id;

    await this.chatService.markAsSeen(
      body.conversationId,
      userId,
      body.messageId,
    );

    this.io
      .to(`conversation:${body.conversationId}`)
      .emit('message:seen:update', {
        conversationId: body.conversationId,
        userId,
        messageId: body.messageId,
      });

    return { success: true };
  }

  // =========================================================
  // TYPING
  // =========================================================
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { conversationId: number },
  ) {
    const userId = client.data.user.user_id;

    client.to(`conversation:${body.conversationId}`).emit('typing:start', {
      conversationId: body.conversationId,
      userId,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { conversationId: number },
  ) {
    const userId = client.data.user.user_id;

    client.to(`conversation:${body.conversationId}`).emit('typing:stop', {
      conversationId: body.conversationId,
      userId,
    });
  }
}
