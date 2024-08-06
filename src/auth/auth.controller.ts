import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup.dto';
import { ISuccessAndMessageResponse } from './interfaces/successMessage.response.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Currentuser } from 'src/common/decorators/currentUser.decorator';
import { Response } from 'express';
import { LoginUserDto } from './dto/login.dto';
import { JWtAuthGuard } from './guards/jwt.auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(
    @Body() signupUserDto: SignupUserDto,
  ): Promise<ISuccessAndMessageResponse> {
    return this.authService.signupUser(signupUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(
    @Body() loginUserDto: LoginUserDto,
    @Currentuser() user: TokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginUser(user, response);
  }

  @Get('me')
  @UseGuards(JWtAuthGuard)
  async getUser(@Currentuser() user: User): Promise<User> {
    return user;
  }
}
