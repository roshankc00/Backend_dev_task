import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { USER_ROLE_ENUM } from 'src/common/enums/user.role.enum';

@Schema({ versionKey: false })
export class User extends AbstractEntity {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: String, enum: USER_ROLE_ENUM, default: USER_ROLE_ENUM.USER })
  role: USER_ROLE_ENUM;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(User);
