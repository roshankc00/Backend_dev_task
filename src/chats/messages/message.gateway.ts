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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: '*',
})
export class SocketGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private publisher: Redis;
  private subscriber: Redis;
  constructor(
    private readonly messageService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    this.publisher = new Redis(this.configService.get('REDIS_URI'));
    this.subscriber = new Redis(this.configService.get('REDIS_URI'));

    this.subscriber.subscribe('chat_messages');
    this.subscriber.on('message', (channel, message) => {
      if (channel === 'chat_messages') {
        const data = JSON.parse(message);
        this.server
          .to(`chat-${data?.chatId}`)
          .emit('receive_message', JSON.parse(message));
      }
    });
  }

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
    @MessageBody() { chatId, content, senderId }: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.eventEmitter.emit('message_create', { chatId, content, senderId });
    await this.publisher.publish(
      'chat_messages',
      JSON.stringify({
        chatId,
        content,
        senderId,
      }),
    );
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
