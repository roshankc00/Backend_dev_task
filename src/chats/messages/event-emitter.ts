import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Injectable()
export class Emitters {
  constructor(private readonly messageService: MessagesService) {}
  @OnEvent('message_create')
  async getData(data: CreateMessageDto) {
    await this.messageService.create(data);
  }
}
