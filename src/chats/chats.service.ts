import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsRepository } from './repositories/chat.repository';
import * as mongoose from 'mongoose';
import { UsersService } from '../users/users.service';
import { AddUserToGroupDto } from './dto/add-userTo-group';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(createChatDto: CreateChatDto, user: User) {
    if (user.email === createChatDto.email) {
      throw new BadRequestException('Not allowed');
    }

    const anotherUser = await this.usersService.getUserWithEmail(
      createChatDto.email,
    );

    return this.chatsRepository.create({
      chat_type: createChatDto.chat_type,
      name: createChatDto.name,
      users: [user, anotherUser],
    });
  }

  async findAll(user: User) {
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
      const chats = await this.chatsRepository.model
        .find({
          users: userId,
        })
        .exec();

      return chats;
    } catch (error) {
      console.error('Error fetching chats for user:', error);
      throw error;
    }
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
    const chat = await this.chatsRepository.findOne({
      _id: addUserToGroupDto.chatId,
    });

    if (!chat || !user) {
      throw new BadRequestException('Invalid chat or user');
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    if (
      chat.users.some(
        (existingUser) => existingUser.toString() === userId.toString(),
      )
    ) {
      throw new BadRequestException('User already exists in the group');
    }

    chat.users.push(user);

    return this.chatsRepository.findOneAndUpdate(
      { _id: chat._id },
      { $set: { users: chat.users } },
    );
  }
}
