import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsRepository } from './repositories/chat.repository';
import { Schema as MongooseSchema } from 'mongoose';
@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
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
}
