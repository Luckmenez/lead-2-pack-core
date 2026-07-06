import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCompradorDto } from './dto/login-comprador.dto';
import { LoginSelecionarPerfilDto } from './dto/login-selecionar-perfil.dto';
import { RegisterCompradorDto } from './dto/register-comprador.dto';
import { RegisterFornecedorDto } from './dto/register-fornecedor.dto';
import { RegisterProfissionalDto } from './dto/register-profissional.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TrocarPerfilDto } from './dto/trocar-perfil.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('comprador/register')
  async registerComprador(@Body() dto: RegisterCompradorDto) {
    return this.authService.registerComprador(dto);
  }

  @Get('perfis-vinculados')
  @UseGuards(JwtAuthGuard)
  async getPerfisVinculados(@CurrentUser() user: JwtPayload) {
    return this.authService.getPerfisVinculados(user.email, user.tipo);
  }

  @Post('trocar-perfil')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async trocarPerfil(
    @CurrentUser() user: JwtPayload,
    @Body() dto: TrocarPerfilDto,
  ) {
    return this.authService.trocarPerfil(user.email, dto.perfil);
  }

  @Post('login/selecionar-perfil')
  @HttpCode(HttpStatus.OK)
  async loginSelecionarPerfil(@Body() dto: LoginSelecionarPerfilDto) {
    return this.authService.loginSelecionarPerfil(
      dto.email,
      dto.senha,
      dto.perfil,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginCompradorDto) {
    return this.authService.login(dto.email, dto.senha);
  }

  @Post('fornecedor/register')
  async registerFornecedor(@Body() dto: RegisterFornecedorDto) {
    return this.authService.registerFornecedor(dto);
  }

  @Post('profissional/register')
  async registerProfissional(@Body() dto: RegisterProfissionalDto) {
    return this.authService.registerProfissional(dto);
  }

  @Post('esqueci-senha')
  @HttpCode(HttpStatus.OK)
  async esqueciSenha(@Body() dto: ForgotPasswordDto) {
    await this.authService.solicitarRecuperacaoSenha(dto.email);
    return {
      message:
        'Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
    };
  }

  @Post('redefinir-senha')
  @HttpCode(HttpStatus.OK)
  async redefinirSenha(@Body() dto: ResetPasswordDto) {
    await this.authService.redefinirSenha(dto.token, dto.novaSenha);
    return { message: 'Senha redefinida com sucesso.' };
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() dto: LoginCompradorDto) {
    return this.authService.loginAdmin(dto.email, dto.senha);
  }

  @Post('colaborador/aceitar-convite')
  @HttpCode(HttpStatus.OK)
  async aceitarConvite(@Body() dto: { token: string; senha: string }) {
    return this.authService.aceitarConviteColaborador(dto.token, dto.senha);
  }
}
