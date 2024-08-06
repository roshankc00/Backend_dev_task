import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './repositories/message.repository';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { DatabaseModule } from '../../../src/common/database/database.module';
import { SocketGatewayGateway } from './message.gateway';
import { Emitters } from './event-emitter';
import { ChatsModule } from '../chats.module';
import { UsersModule } from '../../../src/users/users.module';
import { forwardRef } from '@nestjs/common';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        forwardRef(() => ChatsModule),
        UsersModule,
      ],
      controllers: [MessagesController],
      providers: [
        MessagesService,
        MessagesRepository,
        {
          provide: SocketGatewayGateway,
          useValue: {
            // Mock implementation
          },
        },
        {
          provide: Emitters,
          useValue: {
            // Mock implementation
          },
        },
        ConfigService,
        {
          provide: getModelToken(Message.name),
          useValue: Model, // Mocked Model
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
