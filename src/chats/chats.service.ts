import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsRepository } from './repositories/chat.repository';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { AddUserToGroupDto } from './dto/add-userTo-group';
@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
  ) {}
  create(createChatDto: CreateChatDto) {
    return this.chatsRepository.create({
      ...createChatDto,
      users: [],
    });
  }

  findAll(payload: TokenPayload) {
    const userId = payload._id;
    return this.chatsRepository.model
      .aggregate([
        {
          $match: {
            users: new MongooseSchema.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'users',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            chat_type: 1,
            userDetails: 1,
          },
        },
      ])
      .exec();
  }

  findOne(id: string) {
    return this.chatsRepository.findOne({ _id: id });
  }

  update(id: string, updateChatDto: UpdateChatDto) {
    return this.chatsRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: updateChatDto,
      },
    );
  }

  remove(id: string) {
    return this.chatsRepository.findOneAndDelete({ _id: id });
  }

  async addUsertoGroup(addUserToGroupDto: AddUserToGroupDto) {
    const user = await this.usersService.getUserWithEmail(
      addUserToGroupDto.email,
    );
    const chats = await this.chatsRepository.findOne({
      _id: addUserToGroupDto.chatId,
    });
    if (!chats || !user) {
      throw new BadRequestException('invalid');
    }

    const userId = new MongooseSchema.Types.ObjectId(user._id.toString());

    if (chats.users.some((user) => user.toString() === userId.toString())) {
      throw new BadRequestException('User already exists in the group');
    }

    chats.users.push(userId);

    return this.chatsRepository.findOneAndUpdate(
      { _id: chats._id },
      { $set: { users: chats.users } },
    );
  }
}
