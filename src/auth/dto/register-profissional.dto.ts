import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsString()
  telefonePessoal: string;

  @IsNotEmpty({ message: 'WhatsApp pessoal é obrigatório' })
  @IsString()
  whatsappPessoal: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  emailPessoal: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  redeSocial?: string;

  @IsArray()
  @IsString({ each: true })
  categoriasProdutos: string[];

  @IsArray()
  @IsString({ each: true })
  materiais: string[];

  @IsArray()
  @IsString({ each: true })
  servicos: string[];

  @IsArray()
  @IsString({ each: true })
  setores: string[];

  @IsNotEmpty({ message: 'Descrição institucional é obrigatória' })
  @IsString()
  @MinLength(30, { message: 'Descrição deve ter no mínimo 30 caracteres' })
  @MaxLength(300)
  descricaoInstitucional: string;

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
