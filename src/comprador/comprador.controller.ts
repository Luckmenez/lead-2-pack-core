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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CompradorService } from './comprador.service';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
  IsUrl,
} from 'class-validator';

class UpdateCompradorMeDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'nomeCompleto deve ter no mínimo 3 caracteres' })
  nomeCompleto?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email inválido' })
  email?: string;

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
  @Matches(/^\d{10,11}$/, {
    message: 'telefoneComercial deve conter apenas dígitos (10 ou 11)',
  })
  telefoneComercial?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'whatsappComercial deve conter apenas dígitos (10 ou 11)',
  })
  whatsappComercial?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'razaoSocial deve ter no mínimo 3 caracteres' })
  razaoSocial?: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string | null;

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
}

@Controller('compradores')
export class CompradorController {
  constructor(private readonly compradorService: CompradorService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.compradorService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('comprador')
  async getMe(@CurrentUser() user: JwtPayload) {
    const perfil = await this.compradorService.findMe(user.sub);
    if (!perfil) throw new NotFoundException('Comprador não encontrado');
    return perfil;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('comprador')
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCompradorMeDto,
  ) {
    const perfil = await this.compradorService.updateMe(user.sub, dto);
    if (!perfil) throw new NotFoundException('Comprador não encontrado');
    return perfil;
  }
}
