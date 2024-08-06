import { IsNotEmpty, IsString } from 'class-validator';

export class FindAllMessagesOfChat {
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
