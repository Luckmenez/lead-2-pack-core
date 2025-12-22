import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { ApiResponse } from '@shared/types/responses/api-response.interface';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @SwaggerResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
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
        name: authResult.name,
        role: authResult.role,
        accessToken,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
