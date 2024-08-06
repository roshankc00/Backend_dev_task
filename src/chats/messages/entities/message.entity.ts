import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
@Schema({ versionKey: false })
export class Message extends AbstractEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
  chat: Chat;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
