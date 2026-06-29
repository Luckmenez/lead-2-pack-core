import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PROFISSIONAL_CATEGORIAS } from '../../catalog/categorias-cadastro';
import { normalizeWebsite } from '../../utils/website';

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export class RegisterProfissionalDto {
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString()
  cpf: string;

  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty({ message: 'Apelido é obrigatório' })
  @IsString()
  apelido: string;

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
  emailPessoal: string;

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

  @IsNotEmpty({ message: 'Tipo de empresa é obrigatório' })
  @IsEnum(['mei', 'lucro_presumido', 'simples_nacional'], {
    message: 'Tipo de empresa inválido',
  })
  tipoEmpresa: 'mei' | 'lucro_presumido' | 'simples_nacional';

  @IsArray()
  @ArrayNotEmpty({ message: 'Selecione ao menos uma categoria' })
  @IsIn([...PROFISSIONAL_CATEGORIAS], {
    each: true,
    message: 'categoria inválida',
  })
  categoriasProdutos: string[];

  @IsNotEmpty({ message: 'Descrição institucional é obrigatória' })
  @IsString()
  @MinLength(30, { message: 'Descrição deve ter no mínimo 30 caracteres' })
  @MaxLength(300)
  descricaoInstitucional: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'URL de portfólio inválida' })
  portfolioUrls?: string[];

  @IsNotEmpty({ message: 'Forma de pagamento é obrigatória' })
  @IsEnum(['cartao', 'boleto', 'pix'], {
    message: 'Forma de pagamento inválida',
  })
  formaPagamento: 'cartao' | 'boleto' | 'pix';

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(SENHA_REGEX, {
    message: 'Senha deve ter uma letra maiúscula e um caractere especial',
  })
  senha: string;
}
