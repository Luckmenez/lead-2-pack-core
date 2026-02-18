import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCompradorDto } from './dto/login-comprador.dto';
import { RegisterCompradorDto } from './dto/register-comprador.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('comprador/register')
  async registerComprador(@Body() dto: RegisterCompradorDto) {
    return this.authService.registerComprador(dto);
  }

  @Post('comprador/login')
  @HttpCode(HttpStatus.OK)
  async loginComprador(@Body() dto: LoginCompradorDto) {
    return this.authService.loginComprador(dto.cpf, dto.senha);
  }
}
