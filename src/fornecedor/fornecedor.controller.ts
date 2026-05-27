import { BadRequestException, Body, Controller, Get, NotFoundException, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { FornecedorService } from './fornecedor.service';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

class UpdatePortfolioDto {
  @IsArray()
  @IsUrl({}, { each: true })
  portfolioUrls: string[];
}

class UpdateFornecedorMeDto {
  @IsOptional()
  @IsEmail({}, { message: 'email inválido' })
  email?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'telefone deve conter apenas dígitos (10 ou 11)' })
  telefone?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'whatsapp deve conter apenas dígitos (10 ou 11)' })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsOptional()
  @ValidateIf(o => o.website !== undefined && o.website !== '')
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'website deve ser uma URL válida com http:// ou https://' })
  website?: string;

  @IsOptional()
  @IsString()
  redeSocial?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @Matches(/^[A-Z]{2}$/, { message: 'estado deve ser uma UF válida com 2 letras maiúsculas' })
  estado?: string;

  @IsOptional()
  @IsIn(['estadual', 'municipal'], { message: 'tipoInscricao deve ser "estadual" ou "municipal"' })
  tipoInscricao?: string;

  @IsOptional()
  @IsString()
  numeroInscricao?: string;

  @IsOptional()
  @IsIn(['mei', 'lucro_presumido', 'simples_nacional'], { message: 'tipoEmpresa deve ser "mei", "lucro_presumido" ou "simples_nacional"' })
  tipoEmpresa?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoriasProdutos?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  materiais?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  servicos?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  setores?: string[];

  @IsOptional()
  @IsString()
  @MinLength(30, { message: 'descricaoInstitucional deve ter no mínimo 30 caracteres' })
  @MaxLength(500, { message: 'descricaoInstitucional deve ter no máximo 500 caracteres' })
  descricaoInstitucional?: string;
}

@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('material') material?: string,
  ) {
    return this.fornecedorService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      material,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload) {
    const perfil = await this.fornecedorService.findMe(user.sub);
    if (!perfil) throw new NotFoundException('Fornecedor não encontrado');
    return perfil;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateFornecedorMeDto,
  ) {
    const perfil = await this.fornecedorService.updateMe(user.sub, dto);
    if (!perfil) throw new NotFoundException('Fornecedor não encontrado');
    return perfil;
  }

  @Patch('portfolio')
  @UseGuards(JwtAuthGuard)
  async updatePortfolio(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.fornecedorService.updatePortfolio(user.sub, dto.portfolioUrls);
  }
}
