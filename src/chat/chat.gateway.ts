import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map();

  constructor(private chatService: ChatService, private jwtService : JwtService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: any) {
    try {
      const token = data.token;
      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId; 

      const chat = await this.chatService.getOrCreateChat([userId, data.receiver]);

      const message = await this.chatService.createMessage(userId, data.content, chat._id.toString());

      const receiverSocketId = this.userSockets.get(data.receiver);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
      }

      return { event: 'messageSent', data: message };
    } catch (error) {
      return { event: 'messageError', data: { error: error.message } };
    }
  }

}