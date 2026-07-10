import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { PortfolioService } from './portfolio.service';

class UploadUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsIn(['fornecedor', 'profissional'])
  userType: 'fornecedor' | 'profissional';

  @IsString()
  @IsNotEmpty()
  userId: string;
}

class DeleteFileDto {
  @IsUrl({ require_tld: false })
  url: string;
}

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('upload-url')
  async getUploadUrl(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UploadUrlDto,
  ) {
    if (user.tipo !== dto.userType || user.sub !== dto.userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.portfolioService.getUploadUrl(
      dto.filename,
      dto.contentType,
      dto.userType,
      dto.userId,
    );
  }

  @Get('download-url')
  async getDownloadUrl(
    @CurrentUser() user: JwtPayload,
    @Query('url') url?: string,
  ) {
    if (!url) throw new BadRequestException('url é obrigatório');

    const key = this.portfolioService.parseKeyFromPublicUrl(url);
    if (!key) throw new BadRequestException('URL inválida');
    if (!this.portfolioService.canAccess(user, key)) {
      throw new ForbiddenException('Acesso negado');
    }

    return { downloadUrl: await this.portfolioService.getDownloadUrl(key) };
  }

  @Post('delete')
  async deleteFile(@CurrentUser() user: JwtPayload, @Body() dto: DeleteFileDto) {
    const key = this.portfolioService.parseKeyFromPublicUrl(dto.url);
    if (!key) throw new BadRequestException('URL inválida');
    if (!this.portfolioService.canDelete(user, key)) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.portfolioService.deleteFile(key);
    return { ok: true };
  }
}
