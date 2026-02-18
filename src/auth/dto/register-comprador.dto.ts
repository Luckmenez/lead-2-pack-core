import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const SENHA_REGEX =
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export class RegisterCompradorDto {
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString()
  cpf: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(SENHA_REGEX, {
    message:
      'Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial',
  })
  senha: string;

  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty({ message: 'Telefone pessoal é obrigatório' })
  @IsString()
  telefonePessoal: string;

  @IsNotEmpty({ message: 'E-mail pessoal é obrigatório' })
  @IsEmail()
  emailPessoal: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString()
  cnpj: string;

  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString()
  razaoSocial: string;

  @IsNotEmpty({ message: 'E-mail comercial é obrigatório' })
  @IsEmail()
  emailComercial: string;

  @IsNotEmpty({ message: 'Telefone comercial é obrigatório' })
  @IsString()
  telefoneComercial: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  redeSocial?: string;
}
