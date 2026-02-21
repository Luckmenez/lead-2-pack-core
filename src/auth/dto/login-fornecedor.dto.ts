import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginFornecedorDto {
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString()
  cpf: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(1, { message: 'Senha é obrigatória' })
  senha: string;
}
