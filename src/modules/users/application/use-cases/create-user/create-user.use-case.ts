import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { BcryptPasswordHasherService } from '../../../infrastructure/services/bcrypt-password-hasher.service';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const email = Email.create(dto.email);

    const emailExists = await this.userRepository.existsByEmail(email);

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    const plainPassword = Password.create(dto.password);

    const hashedPassword = await this.passwordHasher.hash(plainPassword.value);
    const password = Password.fromHash(hashedPassword);

    const user = UserEntity.create({
      email,
      password,
      role: dto.role,
      profileData: dto.profileData,
    });

    return await this.userRepository.save(user);
  }
}
