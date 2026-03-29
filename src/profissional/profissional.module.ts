import { Module } from '@nestjs/common';
import { ProfissionalController } from './profissional.controller';
import { ProfissionalService } from './profissional.service';

@Module({
  controllers: [ProfissionalController],
  providers: [ProfissionalService],
  exports: [ProfissionalService],
})
export class ProfissionalModule {}
