import { Module } from '@nestjs/common';
import { ContatoController } from './contato.controller';
import { ContatoService } from './contato.service';
import { CompradorModule } from '../comprador/comprador.module';
import { FornecedorModule } from '../fornecedor/fornecedor.module';
import { ProfissionalModule } from '../profissional/profissional.module';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MailModule,
    CompradorModule,
    FornecedorModule,
    ProfissionalModule,
  ],
  controllers: [ContatoController],
  providers: [ContatoService],
})
export class ContatoModule {}
