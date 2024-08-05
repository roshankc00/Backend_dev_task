import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepositary } from 'src/common/database/abstract.repositary';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends AbstractRepositary<User> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(@InjectModel(User.name) usersModel: Model<User>) {
    super(usersModel);
  }
}
