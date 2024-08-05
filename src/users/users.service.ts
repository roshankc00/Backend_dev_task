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
      isVerfied: false,
    });
    const { activationcode, activationtoken } =
      this.createActivationToken(user);
    return {
      success: true,
      message: USER_CONTANTS.REGISTERED,
      activationToken: activationtoken,
    };
  }

  async verifyUserEmail(emailVerificationDto: EmailVerificationDto) {
    let payload: EmailVerificationTokenPayload;

    try {
      payload = jwt.verify(
        emailVerificationDto.activationToken,
        this.configService.get('ACTIVATION_SECRET') as jwt.Secret,
      ) as EmailVerificationTokenPayload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired');
      }
      throw new BadRequestException('Invalid token');
    }

    if (!payload) {
      throw new BadRequestException('Invalid token');
    }

    if (payload.activationcode !== emailVerificationDto.activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const user = await this.usersRepository.findOne({
      _id: payload.userId,
      email: payload.email,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isVerfied) {
      throw new BadRequestException('user already verified');
    }

    await this.usersRepository.findOneAndUpdate(
      {
        _id: payload.userId,
        email: payload.email,
      },
      {
        $set: {
          isVerfied: true,
        },
      },
    );

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  private createActivationToken(user: User): IActivationToken {
    const activationcode = Math.floor(1000 + Math.random() * 9000).toString();
    const activationtoken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        activationcode,
      },
      this.configService.get('ACTIVATION_SECRET') as jwt.Secret,
      {
        expiresIn: `${this.configService.get('EMAIL_VERIFICATION_EXPIRATION_MINUTE')}m`,
      },
    );

    return { activationtoken, activationcode };
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
      .findOne({ email })
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

  async getUserWithEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  private hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };
}
