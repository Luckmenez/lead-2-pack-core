import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ example: 'joao@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123', description: 'User password' })
  @IsString()
  password: string;
}
