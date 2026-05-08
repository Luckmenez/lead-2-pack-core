import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export enum PerfilLoginSelecao {
  comprador = 'comprador',
  fornecedor = 'fornecedor',
}

export class LoginSelecionarPerfilDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(1, { message: 'Senha é obrigatória' })
  senha: string;

  @IsEnum(PerfilLoginSelecao, {
    message: 'Perfil deve ser comprador ou fornecedor',
  })
  perfil: PerfilLoginSelecao;
}
