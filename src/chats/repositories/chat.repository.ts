import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepositary } from 'src/common/database/abstract.repositary';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatsRepository extends AbstractRepositary<Chat> {
  protected readonly logger = new Logger(ChatsRepository.name);
  constructor(@InjectModel(Chat.name) chatsModel: Model<Chat>) {
    super(chatsModel);
  }
}
