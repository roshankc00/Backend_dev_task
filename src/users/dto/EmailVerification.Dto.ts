import { IsNotEmpty, IsString, Min } from 'class-validator';

export class EmailVerificationDto {
  @IsString()
  @IsNotEmpty()
  activationCode: string;

  @IsString()
  @IsNotEmpty()
  activationToken: string;
}
