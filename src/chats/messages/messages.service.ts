import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './repositories/message.repository';
import { ChatsService } from '../chats.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { FindAllMessagesOfChat } from './dto/findAll-messages.query';
import * as mongoose from 'mongoose';
@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const chatExits = await this.chatsService.findOne(createMessageDto.chatId);
    const user = await this.usersService.findOne(createMessageDto.senderId);
    await this.messagesRepository.create({
      chat: chatExits,
      content: createMessageDto.content,
      sender: user,
    });
  }

  findAll(findAllMessagesOfChat: FindAllMessagesOfChat) {
    const { chatId } = findAllMessagesOfChat;

    return this.messagesRepository.model
      .aggregate([
        {
          $match: {
            chat: new mongoose.Types.ObjectId(chatId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'senderInfo',
          },
        },
        {
          $unwind: {
            path: '$senderInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            timestamp: 1,
            'senderInfo._id': 1,
            'senderInfo.name': 1,
            'senderInfo.email': 1,
          },
        },
      ])
      .exec();
  }

  async findOne(id: string) {
    const message = await this.messagesRepository.findOne({ _id: id });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, user: User) {
    await this.validateMessageOwner(id, user);
    return this.messagesRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateMessageDto },
    );
  }

  async remove(id: string, user: User) {
    await this.validateMessageOwner(id, user);
    return this.messagesRepository.findOneAndDelete({ _id: id });
  }

  private async validateMessageOwner(id: string, user: User) {
    const message = await this.messagesRepository.findOne({ _id: id });
    if (message.sender._id.toString() === user._id.toString()) {
      return message;
    } else {
      throw new BadRequestException();
    }
  }
}
