import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from './register.dto';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user/create-user.use-case';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}
  async execute(dto: AuthRegisterDto): Promise<UserEntity> {
    const user = await this.createUserUseCase.execute({
      email: dto.email,
      password: dto.password,
      role: dto.role,
      profileData: dto.profileData,
      sectorIds: dto.sectorIds,
    });

    return user;
  }
}
