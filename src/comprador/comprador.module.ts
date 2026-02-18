import { Module } from '@nestjs/common';
import { CompradorService } from './comprador.service';

@Module({
  providers: [CompradorService],
  exports: [CompradorService],
})
export class CompradorModule {}
