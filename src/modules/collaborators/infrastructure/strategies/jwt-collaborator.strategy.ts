import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetCollaboratorByIdUseCase } from '../../application/use-cases/get-collaborator-by-id/get-collaborator-by-id.use-case';

interface CollaboratorJwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'collaborator';
}

@Injectable()
export class JwtCollaboratorStrategy extends PassportStrategy(Strategy, 'jwt-collaborator') {
  constructor(
    private readonly configService: ConfigService,
    private readonly getCollaboratorByIdUseCase: GetCollaboratorByIdUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: CollaboratorJwtPayload) {
    // Verifica se é um token de collaborator
    if (payload.type !== 'collaborator') {
      throw new UnauthorizedException('Invalid token type');
    }

    const collaborator = await this.getCollaboratorByIdUseCase.execute(payload.sub);

    if (!collaborator) {
      throw new UnauthorizedException('Collaborator not found');
    }

    if (!collaborator.isActive) {
      throw new UnauthorizedException('Collaborator account is inactive');
    }

    // This will be attached to request.user
    return {
      id: collaborator.id,
      email: collaborator.email.value,
      role: collaborator.role,
      type: 'collaborator' as const,
    };
  }
}
