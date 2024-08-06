import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { CHAT_TYPE_ENUM } from 'src/common/enums/chat.type';
import { User } from 'src/users/entities/user.entity';
import * as mongoose from 'mongoose';
@Schema({ versionKey: false })
export class Chat extends AbstractEntity {
  @Prop({ type: String, enum: CHAT_TYPE_ENUM })
  chat_type: string;

  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
