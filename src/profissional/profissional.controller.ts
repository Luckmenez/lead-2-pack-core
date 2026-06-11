import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { ProfissionalService } from './profissional.service';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
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

class UpdateProfissionalMeDto {
  @IsOptional()
  @IsString()
  nomeCompleto?: string;

  @IsOptional()
  @IsString()
  apelido?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'telefonePessoal deve conter apenas dígitos (10 ou 11)',
  })
  telefonePessoal?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'whatsappPessoal deve conter apenas dígitos (10 ou 11)',
  })
  whatsappPessoal?: string;

  @IsOptional()
  @IsEmail({}, { message: 'emailPessoal inválido' })
  emailPessoal?: string;

  @IsOptional()
  @ValidateIf((o) => o.website !== undefined && o.website !== '')
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'website deve ser uma URL válida com http:// ou https://' },
  )
  website?: string;

  @IsOptional()
  @IsString()
  redeSocial?: string;

  @IsOptional()
  @IsEnum(['mei', 'lucro_presumido', 'simples_nacional'], {
    message:
      'tipoEmpresa deve ser "mei", "lucro_presumido" ou "simples_nacional"',
  })
  tipoEmpresa?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoriasProdutos?: string[];

  @IsOptional()
  @IsString()
  @MinLength(30, {
    message: 'descricaoInstitucional deve ter no mínimo 30 caracteres',
  })
  @MaxLength(300, {
    message: 'descricaoInstitucional deve ter no máximo 300 caracteres',
  })
  descricaoInstitucional?: string;
}

@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly profissionalService: ProfissionalService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('material') material?: string,
  ) {
    return this.profissionalService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      material,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload) {
    const perfil = await this.profissionalService.findMe(user.sub);
    if (!perfil) throw new NotFoundException('Profissional não encontrado');
    return perfil;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfissionalMeDto,
  ) {
    const perfil = await this.profissionalService.updateMe(user.sub, dto);
    if (!perfil) throw new NotFoundException('Profissional não encontrado');
    return perfil;
  }

  @Patch('portfolio')
  @UseGuards(JwtAuthGuard)
  async updatePortfolio(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.profissionalService.updatePortfolio(
      user.sub,
      dto.portfolioUrls,
    );
  }
}
