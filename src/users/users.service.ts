import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcryptjs';
import { USER_ROLE_ENUM } from 'src/common/enums/user.role.enum';
import { ISuccessAndMessageResponse } from 'src/auth/interfaces/successMessage.response.interface';
import { USER_CONTANTS } from './constants/response.constant';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<ISuccessAndMessageResponse> {
    const password = await this.hashPassword(createUserDto.password);
    const userExistWithThisEmail = await this.usersRepository.model.findOne({
      email: createUserDto.email,
    });
    if (userExistWithThisEmail) {
      throw new BadRequestException(USER_CONTANTS.USER_EMAIL_EXIST);
    }
    await this.usersRepository.create({
      ...createUserDto,
      password,
      role: USER_ROLE_ENUM.USER,
    });
    return {
      success: true,
      message: USER_CONTANTS.REGISTERED,
    };
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

  private hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };
}
