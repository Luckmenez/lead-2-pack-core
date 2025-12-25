import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { BcryptPasswordHasherService } from './infrastructure/services/bcrypt-password-hasher.service';

// Domain
import { IUserRepository } from './domain/repositories/user-repository.interface';

// Application
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id/get-user-by-id.use-case';

// Presentation
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UsersController],
  providers: [
    BcryptPasswordHasherService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    GetUserByIdUseCase,
  ],
  exports: [IUserRepository, GetUserByIdUseCase, BcryptPasswordHasherService, CreateUserUseCase],
})
export class UsersModule {}
