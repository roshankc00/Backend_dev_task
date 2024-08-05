import { IsNotEmpty, IsString } from 'class-validator';

export class JoinAndLeaveRoomDto {
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
