import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { CreateCollaboratorUseCase } from '../../application/use-cases/create-collaborator/create-collaborator.use-case';
import { GetCollaboratorByIdUseCase } from '../../application/use-cases/get-collaborator-by-id/get-collaborator-by-id.use-case';
import { CreateCollaboratorRequestDto } from '../dtos/create-collaborator-request.dto';
import { CollaboratorResponseDto } from '../dtos/collaborator-response.dto';
import { CollaboratorResponseMapper } from '../mappers/collaborator-response.mapper';
import { ApiResponse } from '@shared/types/responses/api-response.interface';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '@modules/users/domain/value-objects/password.vo';

@Controller('admin/collaborators')
@ApiTags('Admin - Collaborators')
export class CollaboratorsController {
  constructor(
    private readonly createCollaboratorUseCase: CreateCollaboratorUseCase,
    private readonly getCollaboratorByIdUseCase: GetCollaboratorByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new collaborator' })
  @SwaggerResponse({ status: 201, description: 'Collaborator created successfully' })
  @SwaggerResponse({ status: 409, description: 'Email already in use' })
  async create(
    @Body() dto: CreateCollaboratorRequestDto,
  ): Promise<ApiResponse<CollaboratorResponseDto>> {
    const collaborator = await this.createCollaboratorUseCase.execute({
      email: Email.create(dto.email),
      password: await Password.create(dto.password),
      name: dto.name,
      role: dto.role,
    });

    return {
      success: true,
      data: CollaboratorResponseMapper.toResponse(collaborator),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collaborator by ID' })
  @SwaggerResponse({ status: 200, description: 'Collaborator found' })
  @SwaggerResponse({ status: 404, description: 'Collaborator not found' })
  async getById(@Param('id') id: string): Promise<ApiResponse<CollaboratorResponseDto>> {
    const collaborator = await this.getCollaboratorByIdUseCase.execute(id);

    return {
      success: true,
      data: CollaboratorResponseMapper.toResponse(collaborator),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
