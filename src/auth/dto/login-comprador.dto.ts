import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCompradorDto {
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  senha: string;
}
