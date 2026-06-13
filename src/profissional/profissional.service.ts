import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PROFISSIONAL_CATEGORIAS_FILTRO } from '../catalog/categorias-cadastro';
import { PrismaService } from '../prisma/prisma.service';

type ProfissionalListagem = {
  id: string;
  nomeCompleto: string;
  apelido: string;
  descricaoInstitucional: string;
  categoriasProdutos: unknown;
  website: string | null;
  redeSocial: string | null;
  portfolioUrls: unknown;
};

@Injectable()
export class ProfissionalService {
  constructor(private readonly prisma: PrismaService) {}

  normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '').slice(0, 11);
  }

  async findByCpf(cpf: string) {
    const cpfDigits = this.normalizeCpf(cpf);
    return this.prisma.profissional.findUnique({ where: { cpf: cpfDigits } });
  }

  async findById(id: string) {
    return this.prisma.profissional.findUnique({ where: { id } });
  }

  async findMe(id: string) {
    return this.prisma.profissional.findUnique({
      where: { id },
      select: {
        id: true,
        cpf: true,
        nomeCompleto: true,
        apelido: true,
        telefonePessoal: true,
        whatsappPessoal: true,
        emailPessoal: true,
        website: true,
        redeSocial: true,
        tipoEmpresa: true,
        categoriasProdutos: true,
        descricaoInstitucional: true,
        portfolioUrls: true,
        formaPagamento: true,
        createdAt: true,
      },
    });
  }

  async findByEmailPessoal(email: string) {
    return this.prisma.profissional.findFirst({
      where: { emailPessoal: { equals: email.trim(), mode: 'insensitive' } },
    });
  }

  async create(data: {
    cpf: string;
    senha: string;
    nomeCompleto: string;
    apelido: string;
    telefonePessoal: string;
    whatsappPessoal: string;
    emailPessoal: string;
    website?: string;
    redeSocial?: string;
    tipoEmpresa: string;
    categoriasProdutos: string[];
    descricaoInstitucional: string;
    portfolioUrls?: string[];
    formaPagamento: string;
  }) {
    const bcrypt = await import('bcrypt');
    const cpfDigits = this.normalizeCpf(data.cpf);
    const senhaHash = await bcrypt.hash(data.senha, 10);
    const telefoneDigits = data.telefonePessoal.replace(/\D/g, '').slice(0, 11);
    const whatsappDigits = data.whatsappPessoal.replace(/\D/g, '').slice(0, 11);

    return this.prisma.profissional.create({
      data: {
        cpf: cpfDigits,
        senhaHash,
        nomeCompleto: data.nomeCompleto,
        apelido: data.apelido,
        telefonePessoal: telefoneDigits,
        whatsappPessoal: whatsappDigits,
        emailPessoal: data.emailPessoal,
        website: data.website ?? null,
        redeSocial: data.redeSocial ?? null,
        tipoEmpresa: data.tipoEmpresa,
        categoriasProdutos: data.categoriasProdutos,
        descricaoInstitucional: data.descricaoInstitucional,
        portfolioUrls: data.portfolioUrls ?? [],
        formaPagamento: data.formaPagamento,
      },
    });
  }

  async updateMe(
    id: string,
    data: {
      nomeCompleto?: string;
      apelido?: string;
      telefonePessoal?: string;
      whatsappPessoal?: string;
      emailPessoal?: string;
      website?: string;
      redeSocial?: string;
      tipoEmpresa?: string;
      categoriasProdutos?: string[];
      descricaoInstitucional?: string;
    },
  ) {
    const updateData: any = {};

    if (data.nomeCompleto !== undefined)
      updateData.nomeCompleto = data.nomeCompleto;
    if (data.apelido !== undefined) updateData.apelido = data.apelido;
    if (data.telefonePessoal !== undefined)
      updateData.telefonePessoal = data.telefonePessoal
        .replace(/\D/g, '')
        .slice(0, 11);
    if (data.whatsappPessoal !== undefined)
      updateData.whatsappPessoal = data.whatsappPessoal
        .replace(/\D/g, '')
        .slice(0, 11);
    if (data.emailPessoal !== undefined)
      updateData.emailPessoal = data.emailPessoal;
    if (data.website !== undefined) updateData.website = data.website || null;
    if (data.redeSocial !== undefined)
      updateData.redeSocial = data.redeSocial || null;
    if (data.tipoEmpresa !== undefined)
      updateData.tipoEmpresa = data.tipoEmpresa;
    if (data.categoriasProdutos !== undefined)
      updateData.categoriasProdutos = data.categoriasProdutos;
    if (data.descricaoInstitucional !== undefined)
      updateData.descricaoInstitucional = data.descricaoInstitucional;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Ao menos um campo deve ser informado para atualização',
      );
    }

    try {
      return await this.prisma.profissional.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          cpf: true,
          nomeCompleto: true,
          apelido: true,
          telefonePessoal: true,
          whatsappPessoal: true,
          emailPessoal: true,
          website: true,
          redeSocial: true,
          tipoEmpresa: true,
          categoriasProdutos: true,
          descricaoInstitucional: true,
          portfolioUrls: true,
          formaPagamento: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e?.code === 'P2025')
        throw new NotFoundException('Profissional não encontrado');
      throw e;
    }
  }

  async updatePortfolio(id: string, portfolioUrls: string[]) {
    return this.prisma.profissional.update({
      where: { id },
      data: { portfolioUrls },
      select: { id: true, portfolioUrls: true },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    material?: string;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = params.search?.trim();
    const materialRaw = params.material?.trim();
    const material =
      materialRaw && PROFISSIONAL_CATEGORIAS_FILTRO.includes(materialRaw)
        ? materialRaw
        : undefined;

    const searchPattern = search ? `${search}%` : null;
    const matJson = material ? JSON.stringify([material]) : null;

    const matCond =
      matJson != null
        ? Prisma.sql`categorias_produtos::jsonb @> ${matJson}::jsonb`
        : Prisma.sql`TRUE`;

    const namePrefix =
      searchPattern != null
        ? Prisma.sql`(
      nome_completo ILIKE ${searchPattern}
      OR apelido ILIKE ${searchPattern}
    )`
        : Prisma.sql`TRUE`;

    const whereClause = Prisma.sql`WHERE ${matCond} AND ${namePrefix}`;

    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRaw<ProfissionalListagem[]>`
        SELECT id, nome_completo as "nomeCompleto", apelido,
          descricao_institucional as "descricaoInstitucional",
          categorias_produtos as "categoriasProdutos",
          website, rede_social as "redeSocial",
          portfolio_urls as "portfolioUrls"
        FROM profissionais
        ${whereClause}
        ORDER BY apelido ASC
        LIMIT ${limit}
        OFFSET ${skip}
      `,
      this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*)::bigint as count
        FROM profissionais
        ${whereClause}
      `,
    ]);

    const total = Number(countRows[0]?.count ?? 0);
    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    };
  }
}
