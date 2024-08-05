import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './repositories/message.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { Message, MessageSchema } from './entities/message.entity';
import { SocketGatewayGateway } from './message.gateway';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository, SocketGatewayGateway],
})
export class MessagesModule {}
