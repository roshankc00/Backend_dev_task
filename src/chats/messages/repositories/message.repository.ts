import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepositary } from 'src/common/database/abstract.repositary';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesRepository extends AbstractRepositary<Message> {
  protected readonly logger = new Logger(MessagesRepository.name);
  constructor(@InjectModel(Message.name) MessagesModel: Model<Message>) {
    super(MessagesModel);
  }
}
