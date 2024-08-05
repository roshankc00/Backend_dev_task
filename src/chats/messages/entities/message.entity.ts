import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

@Schema({ versionKey: false })
export class Message extends AbstractEntity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Chat' })
  chatId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop()
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
