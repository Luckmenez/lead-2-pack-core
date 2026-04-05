import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export class RegisterCompradorDto {
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty({ message: 'Telefone pessoal é obrigatório' })
  @IsString()
  telefonePessoal: string;

  @IsNotEmpty({ message: 'WhatsApp pessoal é obrigatório' })
  @IsString()
  whatsappPessoal: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString()
  cnpj: string;

  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString()
  razaoSocial: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsNotEmpty({ message: 'Telefone comercial é obrigatório' })
  @IsString()
  telefoneComercial: string;

  @IsNotEmpty({ message: 'WhatsApp comercial é obrigatório' })
  @IsString()
  whatsappComercial: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  redeSocial?: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(SENHA_REGEX, {
    message: 'Senha deve ter uma letra maiúscula e um caractere especial',
  })
  senha: string;
}
