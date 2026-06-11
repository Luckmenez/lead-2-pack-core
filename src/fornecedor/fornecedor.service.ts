import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FORNECEDOR_CATEGORIAS_FILTRO } from '../catalog/categorias-cadastro';
import { PrismaService } from '../prisma/prisma.service';

type FornecedorListagem = {
  id: string;
  nomeFantasia: string;
  descricaoInstitucional: string;
  categoriasProdutos: unknown;
  materiais: unknown;
  servicos: unknown;
  setores: unknown;
  cidade: string;
  estado: string;
  portfolioUrls: unknown;
};

@Injectable()
export class FornecedorService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.fornecedor.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.fornecedor.findUnique({ where: { id } });
  }

  async findMe(id: string) {
    return this.prisma.fornecedor.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        telefone: true,
        whatsapp: true,
        cnpj: true,
        razaoSocial: true,
        nomeFantasia: true,
        website: true,
        redeSocial: true,
        cidade: true,
        estado: true,
        tipoInscricao: true,
        numeroInscricao: true,
        tipoEmpresa: true,
        categoriasProdutos: true,
        materiais: true,
        servicos: true,
        setores: true,
        descricaoInstitucional: true,
        portfolioUrls: true,
        formaPagamento: true,
        createdAt: true,
      },
    });
  }

  async create(data: {
    email: string;
    senha: string;
    telefone: string;
    whatsapp: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    website: string;
    redeSocial: string;
    cidade: string;
    estado: string;
    tipoInscricao: string;
    numeroInscricao: string;
    tipoEmpresa: string;
    categoriasProdutos: string[];
    materiais: string[];
    servicos: string[];
    setores: string[];
    descricaoInstitucional: string;
    portfolioUrls?: string[];
    formaPagamento: string;
  }) {
    const bcrypt = await import('bcrypt');
    const senhaHash = await bcrypt.hash(data.senha, 10);
    const cnpjDigits = data.cnpj.replace(/\D/g, '').slice(0, 14);
    const telefoneDigits = data.telefone.replace(/\D/g, '').slice(0, 11);
    const whatsappDigits = data.whatsapp.replace(/\D/g, '').slice(0, 11);

    return this.prisma.fornecedor.create({
      data: {
        email: data.email,
        senhaHash,
        telefone: telefoneDigits,
        whatsapp: whatsappDigits,
        cnpj: cnpjDigits,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        website: data.website,
        redeSocial: data.redeSocial,
        cidade: data.cidade,
        estado: data.estado,
        tipoInscricao: data.tipoInscricao,
        numeroInscricao: data.numeroInscricao,
        tipoEmpresa: data.tipoEmpresa,
        categoriasProdutos: data.categoriasProdutos,
        materiais: data.materiais ?? [],
        servicos: data.servicos ?? [],
        setores: data.setores ?? [],
        descricaoInstitucional: data.descricaoInstitucional,
        portfolioUrls: data.portfolioUrls ?? [],
        formaPagamento: data.formaPagamento,
      },
    });
  }

  async updateMe(
    id: string,
    data: {
      email?: string;
      telefone?: string;
      whatsapp?: string;
      razaoSocial?: string;
      nomeFantasia?: string;
      website?: string;
      redeSocial?: string;
      cidade?: string;
      estado?: string;
      tipoInscricao?: string;
      numeroInscricao?: string;
      tipoEmpresa?: string;
      categoriasProdutos?: string[];
      materiais?: string[];
      servicos?: string[];
      setores?: string[];
      descricaoInstitucional?: string;
    },
  ) {
    const updateData: any = {};

    if (data.email !== undefined) updateData.email = data.email;
    if (data.telefone !== undefined)
      updateData.telefone = data.telefone.replace(/\D/g, '').slice(0, 11);
    if (data.whatsapp !== undefined)
      updateData.whatsapp = data.whatsapp.replace(/\D/g, '').slice(0, 11);
    if (data.razaoSocial !== undefined)
      updateData.razaoSocial = data.razaoSocial;
    if (data.nomeFantasia !== undefined)
      updateData.nomeFantasia = data.nomeFantasia;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.redeSocial !== undefined) updateData.redeSocial = data.redeSocial;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.tipoInscricao !== undefined)
      updateData.tipoInscricao = data.tipoInscricao;
    if (data.numeroInscricao !== undefined)
      updateData.numeroInscricao = data.numeroInscricao;
    if (data.tipoEmpresa !== undefined)
      updateData.tipoEmpresa = data.tipoEmpresa;
    if (data.categoriasProdutos !== undefined)
      updateData.categoriasProdutos = data.categoriasProdutos;
    if (data.materiais !== undefined) updateData.materiais = data.materiais;
    if (data.servicos !== undefined) updateData.servicos = data.servicos;
    if (data.setores !== undefined) updateData.setores = data.setores;
    if (data.descricaoInstitucional !== undefined)
      updateData.descricaoInstitucional = data.descricaoInstitucional;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Ao menos um campo deve ser informado para atualização',
      );
    }

    try {
      return await this.prisma.fornecedor.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          telefone: true,
          whatsapp: true,
          cnpj: true,
          razaoSocial: true,
          nomeFantasia: true,
          website: true,
          redeSocial: true,
          cidade: true,
          estado: true,
          tipoInscricao: true,
          numeroInscricao: true,
          tipoEmpresa: true,
          categoriasProdutos: true,
          materiais: true,
          servicos: true,
          setores: true,
          descricaoInstitucional: true,
          portfolioUrls: true,
          formaPagamento: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e?.code === 'P2025')
        throw new NotFoundException('Fornecedor não encontrado');
      throw e;
    }
  }

  async updatePortfolio(id: string, portfolioUrls: string[]) {
    return this.prisma.fornecedor.update({
      where: { id },
      data: { portfolioUrls },
      select: { id: true, portfolioUrls: true },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    /** Filtra por categoria cadastrada (campo `categorias_produtos` JSON). */
    material?: string;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = params.search?.trim();
    const materialRaw = params.material?.trim();
    const material =
      materialRaw && FORNECEDOR_CATEGORIAS_FILTRO.includes(materialRaw)
        ? materialRaw
        : undefined;

    const searchPattern = search ? `%${search}%` : null;
    const matJson = material ? JSON.stringify([material]) : null;

    /**
     * (categoria + busca ampla) OU (nome fantasia ou razão social batem com o texto).
     */
    const matCond =
      matJson != null
        ? Prisma.sql`categorias_produtos::jsonb @> ${matJson}::jsonb`
        : Prisma.sql`TRUE`;

    const fullSearch =
      searchPattern != null
        ? Prisma.sql`(
      nome_fantasia ILIKE ${searchPattern}
      OR razao_social ILIKE ${searchPattern}
      OR descricao_institucional ILIKE ${searchPattern}
      OR categorias_produtos::text ILIKE ${searchPattern}
    )`
        : Prisma.sql`TRUE`;

    const nameMatch =
      searchPattern != null
        ? Prisma.sql`(
      nome_fantasia ILIKE ${searchPattern}
      OR razao_social ILIKE ${searchPattern}
    )`
        : Prisma.sql`FALSE`;

    const whereClause = Prisma.sql`WHERE (
      (${matCond} AND ${fullSearch})
      OR ${nameMatch}
    )`;

    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRaw<FornecedorListagem[]>`
        SELECT id, nome_fantasia as "nomeFantasia",
          descricao_institucional as "descricaoInstitucional",
          categorias_produtos as "categoriasProdutos",
          materiais, servicos, setores, cidade, estado,
          portfolio_urls as "portfolioUrls"
        FROM fornecedores
        ${whereClause}
        ORDER BY nome_fantasia ASC
        LIMIT ${limit}
        OFFSET ${skip}
      `,
      this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*)::bigint as count
        FROM fornecedores
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
