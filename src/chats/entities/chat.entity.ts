import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { CHAT_TYPE_ENUM } from 'src/common/enums/chat.type';
import { Schema as MongooseSchema } from 'mongoose';
@Schema({ versionKey: false })
export class Chat extends AbstractEntity {
  @Prop({ type: String, enum: CHAT_TYPE_ENUM })
  chat_type: string;

  @Prop()
  name: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  users: MongooseSchema.Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
