import { Controller, Param, Delete, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { ISuccessAndMessageResponse } from 'src/auth/interfaces/successMessage.response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ISuccessAndMessageResponse> {
    return this.usersService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
  @Get('verify-email/:token')
  verifyEmail(@Req() req: Request) {
    return this.usersService.verifyUserEmail(req);
  }
}
