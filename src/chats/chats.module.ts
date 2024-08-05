import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MessagesModule } from './messages/messages.module';
import { ChatsRepository } from './repositories/chat.repository';
import { Chat, ChatSchema } from './entities/chat.entity';
import { DatabaseModule } from '../common/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MessagesModule,
    UsersModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository],
  exports: [ChatsService],
})
export class ChatsModule {}
