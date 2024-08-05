import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MessagesModule } from './messages/messages.module';
import { ChatsRepository } from './repositories/chat.repository';
import { Chat, ChatSchema } from './entities/chat.entity';
import { DatabaseModule } from '../common/database/database.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository],
})
export class ChatsModule {}
