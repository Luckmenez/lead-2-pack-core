import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompradorController } from './comprador.controller';
import { CompradorService } from './comprador.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CompradorController],
  providers: [CompradorService],
  exports: [CompradorService],
})
export class CompradorModule {}
