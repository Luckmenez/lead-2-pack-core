import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Infrastructure
import { CollaboratorSchema } from './infrastructure/persistence/collaborator.schema';
import { CollaboratorRepository } from './infrastructure/persistence/collaborator.repository';

// Application - Use Cases
import { CreateCollaboratorUseCase } from './application/use-cases/create-collaborator/create-collaborator.use-case';
import { GetCollaboratorByIdUseCase } from './application/use-cases/get-collaborator-by-id/get-collaborator-by-id.use-case';
import { AuthenticateCollaboratorUseCase } from './application/use-cases/authenticate-collaborator/authenticate-collaborator.use-case';

// Presentation - Controllers
import { CollaboratorsController } from './presentation/controllers/collaborators.controller';
import { CollaboratorAuthController } from './presentation/controllers/collaborator-auth.controller';

// Infrastructure - Strategies and Guards
import { JwtCollaboratorStrategy } from './infrastructure/strategies/jwt-collaborator.strategy';
import { CollaboratorAuthGuard } from './infrastructure/guards/collaborator-auth.guard';

// Import UsersModule for BcryptPasswordHasherService
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollaboratorSchema]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    UsersModule,
  ],
  controllers: [CollaboratorsController, CollaboratorAuthController],
  providers: [
    // Repository
    {
      provide: 'CollaboratorRepositoryInterface',
      useClass: CollaboratorRepository,
    },
    // Use Cases
    CreateCollaboratorUseCase,
    GetCollaboratorByIdUseCase,
    AuthenticateCollaboratorUseCase,
    // Strategies & Guards
    JwtCollaboratorStrategy,
    CollaboratorAuthGuard,
  ],
  exports: [GetCollaboratorByIdUseCase, CollaboratorAuthGuard],
})
export class CollaboratorsModule {}
