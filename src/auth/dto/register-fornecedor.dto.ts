import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export class RegisterFornecedorDto {
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

  @IsNotEmpty()
  @IsString()
  nomeCompleto: string;

  @IsNotEmpty()
  @IsString()
  telefonePessoal: string;

  @IsNotEmpty()
  @IsEmail()
  emailPessoal: string;

  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  razaoSocial: string;

  @IsNotEmpty()
  @IsString()
  nomeFantasia: string;

  @IsNotEmpty()
  @IsEmail()
  emailComercial: string;

  @IsNotEmpty()
  @IsString()
  telefoneComercial: string;

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

  @IsNotEmpty()
  @IsString()
  @MinLength(30, { message: 'Descrição deve ter no mínimo 30 caracteres' })
  descricaoInstitucional: string;

  @IsNotEmpty()
  @IsEnum(['cartao', 'boleto', 'pix'], {
    message: 'Forma de pagamento inválida',
  })
  formaPagamento: 'cartao' | 'boleto' | 'pix';

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  cidade: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  @MinLength(2, { message: 'Selecione o estado' })
  estado: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  redeSocial?: string;
}
