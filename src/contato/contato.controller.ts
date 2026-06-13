import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { ContatoService } from './contato.service';
import { SolicitarContatoDto } from './dto/solicitar-contato.dto';

@Controller('contatos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContatoController {
  constructor(private readonly contatoService: ContatoService) {}

  @Post('fornecedor/:fornecedorId')
  @HttpCode(HttpStatus.OK)
  @Roles('comprador')
  async contatoFornecedor(
    @CurrentUser() user: JwtPayload,
    @Param('fornecedorId', ParseUUIDPipe) fornecedorId: string,
    @Body() dto: SolicitarContatoDto,
  ) {
    return this.contatoService.compradorParaFornecedor(
      user,
      fornecedorId,
      dto.mensagem,
    );
  }

  @Post('comprador/:compradorId')
  @HttpCode(HttpStatus.OK)
  @Roles('fornecedor', 'profissional')
  async contatoComprador(
    @CurrentUser() user: JwtPayload,
    @Param('compradorId', ParseUUIDPipe) compradorId: string,
    @Body() dto: SolicitarContatoDto,
  ) {
    return this.contatoService.paraComprador(user, compradorId, dto.mensagem);
  }

  @Post('profissional/:profissionalId')
  @HttpCode(HttpStatus.OK)
  @Roles('comprador', 'fornecedor')
  async contatoProfissional(
    @CurrentUser() user: JwtPayload,
    @Param('profissionalId', ParseUUIDPipe) profissionalId: string,
    @Body() dto: SolicitarContatoDto,
  ) {
    return this.contatoService.paraProfissional(
      user,
      profissionalId,
      dto.mensagem,
    );
  }
}
