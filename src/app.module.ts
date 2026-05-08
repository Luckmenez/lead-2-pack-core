import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CompradorModule } from './comprador/comprador.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { AuthModule } from './auth/auth.module';
import { ContatoModule } from './contato/contato.module';

@Module({
  imports: [
    PrismaModule,
    CompradorModule,
    FornecedorModule,
    ProfissionalModule,
    AuthModule,
    ContatoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
