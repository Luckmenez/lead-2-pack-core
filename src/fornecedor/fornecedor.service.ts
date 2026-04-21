import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MATERIAIS_FILTRO_OPCOES } from '../catalog/materiais-cadastro';
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
        materiais: data.materiais,
        servicos: data.servicos,
        setores: data.setores,
        descricaoInstitucional: data.descricaoInstitucional,
        formaPagamento: data.formaPagamento,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    /** Filtra por um material cadastrado (campo `materiais` JSON). */
    material?: string;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = params.search?.trim();
    const materialRaw = params.material?.trim();
    const material =
      materialRaw && MATERIAIS_FILTRO_OPCOES.includes(materialRaw)
        ? materialRaw
        : undefined;

    const searchPattern = search ? `%${search}%` : null;
    const matJson = material ? JSON.stringify([material]) : null;

    /**
     * (material + busca ampla) OU (nome fantasia ou razão social batem com o texto).
     * Assim, com material "errado" no filtro ainda achar a empresa pelo nome digitado.
     */
    const matCond =
      matJson != null
        ? Prisma.sql`materiais::jsonb @> ${matJson}::jsonb`
        : Prisma.sql`TRUE`;

    const fullSearch =
      searchPattern != null
        ? Prisma.sql`(
      nome_fantasia ILIKE ${searchPattern}
      OR razao_social ILIKE ${searchPattern}
      OR descricao_institucional ILIKE ${searchPattern}
      OR materiais::text ILIKE ${searchPattern}
      OR servicos::text ILIKE ${searchPattern}
      OR categorias_produtos::text ILIKE ${searchPattern}
      OR setores::text ILIKE ${searchPattern}
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
          materiais, servicos, setores, cidade, estado
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
