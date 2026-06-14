import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeWebsite } from '../../utils/website';

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export class RegisterCompradorDto {
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty({ message: 'Telefone pessoal é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'telefonePessoal deve conter apenas dígitos (10 ou 11)',
  })
  telefonePessoal: string;

  @IsNotEmpty({ message: 'WhatsApp pessoal é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'whatsappPessoal deve conter apenas dígitos (10 ou 11)',
  })
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
  @Matches(/^\d{10,11}$/, {
    message: 'telefoneComercial deve conter apenas dígitos (10 ou 11)',
  })
  telefoneComercial: string;

  @IsNotEmpty({ message: 'WhatsApp comercial é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'whatsappComercial deve conter apenas dígitos (10 ou 11)',
  })
  whatsappComercial: string;

  @IsOptional()
  @Transform(({ value }) => normalizeWebsite(value))
  @ValidateIf((o) => o.website !== undefined && o.website !== '')
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'website deve ser uma URL válida com http:// ou https://' },
  )
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
