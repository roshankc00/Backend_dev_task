import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './repositories/message.repository';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ChatsService } from '../chats.service';
@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly chatsService: ChatsService,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const chatExits = await this.chatsService.findOne(createMessageDto.chatId);
    await this.messagesRepository.create({
      chatId: new MongooseSchema.Types.ObjectId(createMessageDto.chatId),
      content: createMessageDto.content,
      senderId: new MongooseSchema.Types.ObjectId(createMessageDto.senderId),
    });
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
