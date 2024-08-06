import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import * as mongoose from 'mongoose';
@Schema({ versionKey: false })
export class Chat extends AbstractEntity {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
