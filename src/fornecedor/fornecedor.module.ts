import { Module } from '@nestjs/common';
import { FornecedorController } from './fornecedor.controller';
import { FornecedorService } from './fornecedor.service';

@Module({
  controllers: [FornecedorController],
  providers: [FornecedorService],
  exports: [FornecedorService],
})
export class FornecedorModule {}
