import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return { email: user.email, tipo: user.tipo };
  }

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('cadastros')
  cadastros() {
    return this.adminService.getCadastros();
  }

  @Get('pagamentos')
  pagamentos() {
    return this.adminService.getPagamentos();
  }

  @Get('colaboradores')
  colaboradores() {
    return this.adminService.getColaboradores();
  }

  @Post('colaboradores/convidar')
  convidar(@Body() dto: { email: string; nome: string; role: 'admin' | 'suporte' }) {
    return this.adminService.convidarColaborador(dto.email, dto.nome, dto.role);
  }

  @Delete('colaboradores/:id')
  removerColaborador(@Param('id') id: string) {
    return this.adminService.removerColaborador(id);
  }

  @Get('planos')
  planos() {
    return this.adminService.getPlanos();
  }

  @Patch('planos/:id')
  updatePlano(@Param('id') id: string, @Body() dto: { valor: number; limiteProdutos: number }) {
    return this.adminService.updatePlano(id, dto.valor, dto.limiteProdutos);
  }
}
