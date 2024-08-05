import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class AddUserToGroupDto {
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
