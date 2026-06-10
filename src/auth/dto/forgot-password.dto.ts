import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @IsNotEmpty()
  email: string;
}
