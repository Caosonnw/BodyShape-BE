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
  @WebSocketServer() io: Server;
  private readonly logger = new Logger(ChatGateway.name);
  constructor(
    private readonly chat: ChatService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  // 1) Middleware xác thực cho namespace /chat
  afterInit(server: Server) {
    const secret = this.cfg.get<string>('JWT_SECRET');

    // Socket.IO middleware: verify JWT cho mọi kết nối
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

        // Lưu user vào socket.data
        socket.data.user = {
          user_id: uid,
          role: payload.role,
        };
        next();
      } catch (e: any) {
        return next(new Error(e?.message || 'Unauthorized'));
      }
    });

    this.logger.log('[ChatGateway] ready on :8081 /chat');
  }

  async handleConnection(client: Socket) {
    console.log(
      `🔌 Client connected: ${client.id} (user ${client.data.user.user_id})`,
    );
  }

  async handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }
}
