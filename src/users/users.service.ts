import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcryptjs';
import { USER_ROLE_ENUM } from 'src/common/enums/user.role.enum';
import { ISuccessAndMessageResponse } from 'src/auth/interfaces/successMessage.response.interface';
import { USER_CONTANTS } from './constants/response.constant';
import { User } from './entities/user.entity';
import { EmailService } from '../common/email/email.service';
import {
  EmailVerificationTokenPayload,
  IActivationToken,
} from 'src/auth/interfaces/activationMail.interface';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IVerififyEmail } from 'src/auth/interfaces/verification-email.interface';
import { EmailVerificationDto } from './dto/EmailVerification.Dto';
import { Request } from 'express';
import { set } from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IVerififyEmail> {
    const password = await this.hashPassword(createUserDto.password);
    const userExistWithThisEmail = await this.usersRepository.model.findOne({
      email: createUserDto.email,
    });
    if (userExistWithThisEmail) {
      throw new BadRequestException(USER_CONTANTS.USER_EMAIL_EXIST);
    }
    const user = await this.usersRepository.create({
      ...createUserDto,
      password,
      role: USER_ROLE_ENUM.USER,
      isVerified: false,
    });
    const { activationtoken } = this.createActivationToken(user);
    await this.emailService.sendVerificationEmail({
      subject: 'Email Verification',
      email: user.email,
      name: user.name,
      url: `${this.configService.getOrThrow('CLIENT_URL')}/login?token=${activationtoken}`,
      template: 'emailVerification.ejs',
    });
    return {
      success: true,
      message: USER_CONTANTS.REGISTERED,
      activationToken: activationtoken,
    };
  }

  async verifyUserEmail(req: Request) {
    const token = req.params.token;
    const payload = jwt.verify(
      token,
      this.configService.getOrThrow('ACTIVATION_SECRET'),
    ) as { email: string };

    if (payload?.email) {
      return await this.usersRepository.findOneAndUpdate(
        { email: payload.email },
        { $set: { isVerified: true } },
      );
    } else {
      throw new BadRequestException();
    }
  }

  private createActivationToken(user: User): { activationtoken: string } {
    const activationtoken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      this.configService.get('ACTIVATION_SECRET') as jwt.Secret,
      {
        expiresIn: `${this.configService.get('EMAIL_VERIFICATION_EXPIRATION_MINUTE')}m`,
      },
    );

    return { activationtoken };
  }

  async remove(id: string): Promise<ISuccessAndMessageResponse> {
    const user = await this.usersRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: { isActive: false },
      },
    );

    return {
      success: true,
      message: USER_CONTANTS.DEACTIVATE_ACCOUNT,
    };
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ _id: id });
  }

  async validate(email: string, password: string) {
    const userexist = await this.usersRepository.model
      .findOne({ email, isVerified: true })
      .select('name email password role _id')
      .exec();
    if (!userexist) {
      throw new BadRequestException('User with this email doesnt exists');
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userexist.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid creadentials');
    }

    delete userexist.password;
    return {
      _id: userexist._id,
      email: userexist.email,
      role: userexist.role,
      name: userexist.name,
    };
  }

  async getUserWithEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  private hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };
}
