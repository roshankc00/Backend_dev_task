import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JoinAndLeaveRoomDto } from './dto/join-leave-room.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: '*',
})
export class SocketGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly messageService: MessagesService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('client connected');
  }
  handleDisconnect(client: Socket, ...args: any[]) {
    console.log('client disconnected');
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() { chatId }: JoinAndLeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    socket.join(`chat-${chatId}`);
  }

  @SubscribeMessage('leave_room')
  async onConversationLeave(
    @MessageBody() { chatId }: JoinAndLeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`chat-${chatId}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() { chatId, content }: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(`chat-${chatId}`).emit('receive_message', {
      chatId,
      content,
    });
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() { chatId, isTyping }: { chatId: string; isTyping: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(`chat-${chatId}`).emit('typing', {
      userId: socket.id,
      isTyping,
    });
  }
}
