import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.loginUseCase.execute({ email, password });
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
