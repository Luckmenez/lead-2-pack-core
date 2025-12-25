import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthenticateCollaboratorUseCase } from '../../application/use-cases/authenticate-collaborator/authenticate-collaborator.use-case';
import { CollaboratorLoginRequestDto } from '../dtos/collaborator-login-request.dto';
import { CollaboratorAuthResponseDto } from '../dtos/collaborator-auth-response.dto';
import { CollaboratorResponseMapper } from '../mappers/collaborator-response.mapper';
import { ApiResponse } from '@shared/types/responses/api-response.interface';
import { Public } from '@modules/auth/presentation/decorators/public.decorator';

@Controller('admin/auth')
@ApiTags('Admin - Authentication')
export class CollaboratorAuthController {
  constructor(
    private readonly authenticateCollaboratorUseCase: AuthenticateCollaboratorUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Collaborator login' })
  @SwaggerResponse({ status: 200, description: 'Login successful' })
  @SwaggerResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: CollaboratorLoginRequestDto,
  ): Promise<ApiResponse<CollaboratorAuthResponseDto>> {
    const collaborator = await this.authenticateCollaboratorUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    const payload = {
      sub: collaborator.id,
      email: collaborator.email.value,
      role: collaborator.role,
      type: 'collaborator',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      data: CollaboratorResponseMapper.toAuthResponse(collaborator, accessToken),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
