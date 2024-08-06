import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CHAT_TYPE_ENUM } from 'src/common/enums/chat.type';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
