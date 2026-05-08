import { Body, Controller, Get, NotFoundException, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { FornecedorService } from './fornecedor.service';
import { IsArray, IsUrl } from 'class-validator';

class UpdatePortfolioDto {
  @IsArray()
  @IsUrl({}, { each: true })
  portfolioUrls: string[];
}

@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('material') material?: string,
  ) {
    return this.fornecedorService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      material,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload) {
    const perfil = await this.fornecedorService.findMe(user.sub);
    if (!perfil) throw new NotFoundException('Fornecedor não encontrado');
    return perfil;
  }

  @Patch('portfolio')
  @UseGuards(JwtAuthGuard)
  async updatePortfolio(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.fornecedorService.updatePortfolio(user.sub, dto.portfolioUrls);
  }
}
