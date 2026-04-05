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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { ContatoService } from './contato.service';
import { SolicitarContatoDto } from './dto/solicitar-contato.dto';

@Controller('contatos')
@UseGuards(JwtAuthGuard)
export class ContatoController {
  constructor(private readonly contatoService: ContatoService) {}

  @Post('fornecedor/:fornecedorId')
  @HttpCode(HttpStatus.OK)
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
  async contatoComprador(
    @CurrentUser() user: JwtPayload,
    @Param('compradorId', ParseUUIDPipe) compradorId: string,
    @Body() dto: SolicitarContatoDto,
  ) {
    return this.contatoService.paraComprador(user, compradorId, dto.mensagem);
  }

  @Post('profissional/:profissionalId')
  @HttpCode(HttpStatus.OK)
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
