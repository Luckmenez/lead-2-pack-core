import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { CompradorModule } from '../comprador/comprador.module';
import { FornecedorModule } from '../fornecedor/fornecedor.module';
import { ProfissionalModule } from '../profissional/profissional.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => CompradorModule),
    forwardRef(() => FornecedorModule),
    forwardRef(() => ProfissionalModule),
    MailModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ?? 'lead2pack-dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, JwtModule, PassportModule, JwtStrategy, RolesGuard],
})
export class AuthModule {}
