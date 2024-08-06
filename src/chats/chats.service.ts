import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsRepository } from './repositories/chat.repository';
import * as mongoose from 'mongoose';
import { UsersService } from '../users/users.service';
import { AddUserToGroupDto } from './dto/add-userTo-group';
import { User } from 'src/users/entities/user.entity';
import { ISuccessAndMessageResponse } from 'src/auth/interfaces/successMessage.response.interface';
import { CHATS_CONTANTS } from './constants/responseMessage.constant';
import { Chat } from './entities/chat.entity';
@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(
    createChatDto: CreateChatDto,
    user: User,
  ): Promise<ISuccessAndMessageResponse> {
    if (user.email === createChatDto.email) {
      throw new BadRequestException('Not allowed');
    }

    const anotherUser = await this.usersService.getUserWithEmail(
      createChatDto.email,
    );

    await this.chatsRepository.create({
      name: createChatDto.name,
      users: [user, anotherUser],
    });
    return {
      success: true,
      message: CHATS_CONTANTS.CREATED,
    };
  }

  async findAll(user: User): Promise<Chat[]> {
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

  findOne(id: string): Promise<Chat> {
    return this.chatsRepository.findOne({ _id: id });
  }

  async update(
    id: string,
    updateChatDto: UpdateChatDto,
  ): Promise<ISuccessAndMessageResponse> {
    await this.chatsRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: updateChatDto,
      },
    );
    return {
      success: true,
      message: CHATS_CONTANTS.UPDATED,
    };
  }

  async remove(id: string): Promise<ISuccessAndMessageResponse> {
    await this.chatsRepository.findOneAndDelete({ _id: id });
    return {
      success: true,
      message: CHATS_CONTANTS.DELETED,
    };
  }

  async addUsertoGroup(
    addUserToGroupDto: AddUserToGroupDto,
  ): Promise<ISuccessAndMessageResponse> {
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

    await this.chatsRepository.findOneAndUpdate(
      { _id: chat._id },
      { $set: { users: chat.users } },
    );
    return {
      success: true,
      message: CHATS_CONTANTS.USED_ADDED,
    };
  }
}
