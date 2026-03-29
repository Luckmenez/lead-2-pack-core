import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export class RegisterFornecedorDto {
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString()
  telefone: string;

  @IsNotEmpty({ message: 'WhatsApp é obrigatório' })
  @IsString()
  whatsapp: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString()
  cnpj: string;

  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString()
  razaoSocial: string;

  @IsNotEmpty({ message: 'Nome fantasia é obrigatório' })
  @IsString()
  nomeFantasia: string;

  @IsNotEmpty({ message: 'Website é obrigatório' })
  @IsString()
  website: string;

  @IsNotEmpty({ message: 'Rede social é obrigatória' })
  @IsString()
  redeSocial: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  cidade: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  estado: string;

  @IsNotEmpty({ message: 'Tipo de inscrição é obrigatório' })
  @IsEnum(['estadual', 'municipal'], { message: 'Tipo de inscrição inválido' })
  tipoInscricao: 'estadual' | 'municipal';

  @IsNotEmpty({ message: 'Número de inscrição é obrigatório' })
  @IsString()
  numeroInscricao: string;

  @IsNotEmpty({ message: 'Tipo de empresa é obrigatório' })
  @IsEnum(['mei', 'lucro_presumido', 'simples_nacional'], {
    message: 'Tipo de empresa inválido',
  })
  tipoEmpresa: 'mei' | 'lucro_presumido' | 'simples_nacional';

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
  @MaxLength(500)
  descricaoInstitucional: string;

  @IsNotEmpty({ message: 'Forma de pagamento é obrigatória' })
  @IsEnum(['cartao', 'boleto', 'pix'], { message: 'Forma de pagamento inválida' })
  formaPagamento: 'cartao' | 'boleto' | 'pix';

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(SENHA_REGEX, {
    message: 'Senha deve ter uma letra maiúscula e um caractere especial',
  })
  senha: string;
}
