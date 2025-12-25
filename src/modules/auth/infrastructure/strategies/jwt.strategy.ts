import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { GetUserByIdUseCase } from '../../../users/application/use-cases/get-user-by-id/get-user-by-id.use-case';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.getUserByIdUseCase.execute(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // This will be attached to request.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
