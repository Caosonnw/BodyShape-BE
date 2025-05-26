// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer
// } from '@nestjs/websockets'
// import { PrismaClient } from '@prisma/client'
// import { Server, Socket } from 'socket.io'

// @WebSocketGateway(8081, {
//   cors: {
//     origin: '*'
//   }
// })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server
//   private prisma: PrismaClient = new PrismaClient()

//   handleConnection(client: Socket) {
//     console.log(`🔌 Client connected: ${client.id}`)
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`❌ Client disconnected: ${client.id}`)
//   }

//   @SubscribeMessage('join-room')
//   async handleJoinRoom(socket: Socket, roomId: string) {
//     socket.rooms.forEach((room) => {
//       if (room !== socket.id) {
//         socket.leave(room)
//       }
//     })

//     await socket.join(roomId)

//     const chatHistory = await this.prisma.messages.findMany({
//       where: {
//         room_id: roomId
//       },
//       include: {
//         users: {
//           select: {
//             user_id: true,
//             full_name: true,
//             email: true
//           }
//         }
//       }
//     })

//     this.server.to(roomId).emit('load-chat', chatHistory)
//   }

//   @SubscribeMessage('send-mess')
//   async handleMessage(socket: Socket, data: any) {
//     const { user_id, txtChat, roomId } = data

//     const newChat = {
//       user_id: user_id,
//       content: txtChat,
//       room_id: roomId,
//       create_at: new Date()
//     }

//     const message = await this.prisma.messages.create({ data: newChat })
//     this.server.to(data.roomId).emit('mess-server', message)
//   }
// }
