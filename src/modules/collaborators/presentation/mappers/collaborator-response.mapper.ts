import { CollaboratorEntity } from '../../domain/entities/collaborator.entity';
import { CollaboratorResponseDto } from '../dtos/collaborator-response.dto';
import { CollaboratorAuthResponseDto } from '../dtos/collaborator-auth-response.dto';

export class CollaboratorResponseMapper {
  static toResponse(entity: CollaboratorEntity): CollaboratorResponseDto {
    return {
      id: entity.id,
      email: entity.email.value,
      name: entity.name,
      role: entity.role,
      isActive: entity.isActive,
      lastLogin: entity.lastLogin?.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toAuthResponse(
    entity: CollaboratorEntity,
    accessToken: string,
  ): CollaboratorAuthResponseDto {
    return {
      collaboratorId: entity.id,
      email: entity.email.value,
      name: entity.name,
      role: entity.role,
      accessToken,
    };
  }
}
