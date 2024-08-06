import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Currentuser } from 'src/common/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { FindAllMessagesOfChat } from './dto/findAll-messages.query';
import { ISuccessAndMessageResponse } from 'src/auth/interfaces/successMessage.response.interface';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('')
  findAll(
    @Query() findAllMessagesOfChat: FindAllMessagesOfChat,
  ): Promise<Message[]> {
    return this.messagesService.findAll(findAllMessagesOfChat);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JWtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Currentuser() user: User,
  ): Promise<ISuccessAndMessageResponse> {
    return this.messagesService.update(id, updateMessageDto, user);
  }

  @Delete(':id')
  @UseGuards(JWtAuthGuard)
  remove(
    @Param('id') id: string,
    @Currentuser() user: User,
  ): Promise<ISuccessAndMessageResponse> {
    return this.messagesService.remove(id, user);
  }
}
