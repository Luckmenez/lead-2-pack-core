import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCompradorDto } from './dto/login-comprador.dto';
import { LoginFornecedorDto } from './dto/login-fornecedor.dto';
import { RegisterCompradorDto } from './dto/register-comprador.dto';
import { RegisterFornecedorDto } from './dto/register-fornecedor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('comprador/register')
  async registerComprador(@Body() dto: RegisterCompradorDto) {
    return this.authService.registerComprador(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginCompradorDto) {
    return this.authService.login(dto.cpf, dto.senha);
  }

  @Post('comprador/login')
  @HttpCode(HttpStatus.OK)
  async loginComprador(@Body() dto: LoginCompradorDto) {
    return this.authService.loginComprador(dto.cpf, dto.senha);
  }

  @Post('fornecedor/register')
  async registerFornecedor(@Body() dto: RegisterFornecedorDto) {
    return this.authService.registerFornecedor(dto);
  }

  @Post('fornecedor/login')
  @HttpCode(HttpStatus.OK)
  async loginFornecedor(@Body() dto: LoginFornecedorDto) {
    return this.authService.loginFornecedor(dto.cpf, dto.senha);
  }
}
