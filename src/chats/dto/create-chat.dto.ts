import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CHAT_TYPE_ENUM } from 'src/common/enums/chat.type';

export class CreateChatDto {
  @IsNotEmpty()
  @IsEnum(CHAT_TYPE_ENUM)
  chat_type: CHAT_TYPE_ENUM;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
