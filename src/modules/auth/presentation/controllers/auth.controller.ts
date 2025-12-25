import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register/register.use-case';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { ApiResponse } from '@shared/types/responses/api-response.interface';
import { Public } from '../decorators/public.decorator';
import { ApiLogin } from '../docs/auth.docs';
import { AuthRegisterRequestDto } from '../dtos/register-request.dto';
import { ValidateProfileDataPipe } from '@shared/pipes/validate-profile-data.pipe';
import { RegisterResponseDto } from '../dtos/register-response.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  @ApiLogin()
  async login(@Body() dto: LoginRequestDto): Promise<ApiResponse<AuthResponseDto>> {
    const authResult = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    const payload = {
      sub: authResult.userId,
      email: authResult.email,
      role: authResult.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        userId: authResult.userId,
        email: authResult.email,
        role: authResult.role,
        accessToken,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @UsePipes(ValidateProfileDataPipe)
  @Post('register')
  async register(@Body() dto: AuthRegisterRequestDto): Promise<ApiResponse<RegisterResponseDto>> {
    const registerResult = await this.registerUseCase.execute(dto);

    const payload = {
      sub: registerResult.id,
      email: registerResult.email,
      role: registerResult.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        userId: registerResult.id,
        email: registerResult.email.value,
        role: registerResult.role,
        profileData: registerResult.profileData,
        accessToken,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
