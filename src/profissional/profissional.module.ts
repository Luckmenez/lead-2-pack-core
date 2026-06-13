import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfissionalController } from './profissional.controller';
import { ProfissionalService } from './profissional.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ProfissionalController],
  providers: [ProfissionalService],
  exports: [ProfissionalService],
})
export class ProfissionalModule {}
