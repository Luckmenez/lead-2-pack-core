import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../../../users/domain/repositories/user-repository.interface';
import { Email } from '@shared/domain/value-objects/email.vo';
import { BcryptPasswordHasherService } from '../../../../users/infrastructure/services/bcrypt-password-hasher.service';
import { LoginDto, LoginResult } from './login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const email = Email.create(dto.email);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password.value);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email.value,
      role: user.role,
    };
  }
}
