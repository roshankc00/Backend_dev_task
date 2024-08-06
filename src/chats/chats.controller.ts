import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Currentuser } from 'src/common/decorators/currentUser.decorator';
import { AddUserToGroupDto } from './dto/add-userTo-group';
import { User } from 'src/users/entities/user.entity';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @UseGuards(JWtAuthGuard)
  create(
    @Body() createChatDto: CreateChatDto,
    @Currentuser() user: User,
  ) {
    return this.chatsService.create(createChatDto, user);
  }

  @Get('mine/all')
  @UseGuards(JWtAuthGuard)
  findAll(@Currentuser() user: User) {
    return this.chatsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }

  @Patch('add/user-to-group')
  addUsertoGroup(@Body() addUserToGroupDto: AddUserToGroupDto) {
    return this.chatsService.addUsertoGroup(addUserToGroupDto);
  }
}
