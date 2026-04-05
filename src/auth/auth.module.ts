import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CompradorModule } from '../comprador/comprador.module';
import { FornecedorModule } from '../fornecedor/fornecedor.module';
import { ProfissionalModule } from '../profissional/profissional.module';

@Module({
  imports: [
    CompradorModule,
    FornecedorModule,
    ProfissionalModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ?? 'lead2pack-dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
