import { Module } from '@nestjs/common';
import { CompradorController } from './comprador.controller';
import { CompradorService } from './comprador.service';

@Module({
  controllers: [CompradorController],
  providers: [CompradorService],
  exports: [CompradorService],
})
export class CompradorModule {}
