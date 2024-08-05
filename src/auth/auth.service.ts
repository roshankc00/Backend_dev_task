import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { SignupUserDto } from './dto/signup.dto';
import { ISuccessAndMessageResponse } from './interfaces/successMessage.response.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  signupUser(
    signupUserDto: SignupUserDto,
  ): Promise<ISuccessAndMessageResponse> {
    return this.usersService.create(signupUserDto);
  }

  loginUser(user: TokenPayload, response: Response) {
    const tokenPayload: TokenPayload = user;

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    response.cookie('Authentication', token, {
      expires: new Date(Date.now() + this.configService.get('JWT_EXPIRATION')),
      maxAge: this.configService.get('JWT_EXPIRATION'),
      httpOnly: true,
      secure: true,
    });
    return { ...user, token };
  }
}
