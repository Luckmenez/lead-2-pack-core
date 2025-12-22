import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import Users Module (dependency)
import { UsersModule } from '../users/users.module';

// Application
import { LoginUseCase } from './application/use-cases/login/login.use-case';

// Infrastructure
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    UsersModule, // Import UsersModule to access UserRepository and BcryptPasswordHasherService
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    LoginUseCase,

    // Strategies
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [],
})
export class AuthModule {}
