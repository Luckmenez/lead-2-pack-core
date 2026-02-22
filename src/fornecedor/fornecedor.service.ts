import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const CATEGORIAS_PRODUTOS = [
  'Embalagens Primárias',
  'Embalagens Secundárias',
  'Embalagens Terciárias',
  'Acessórios e Componentes',
  'Etiquetas e Rótulos',
  'Embalagens Sustentáveis/Recicladas',
];

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

  normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '').slice(0, 11);
  }

  async findByCpf(cpf: string) {
    const cpfDigits = this.normalizeCpf(cpf);
    return this.prisma.fornecedor.findUnique({
      where: { cpf: cpfDigits },
    });
  }

  async create(data: {
    cpf: string;
    senha: string;
    nomeCompleto: string;
    telefonePessoal: string;
    emailPessoal: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    emailComercial: string;
    telefoneComercial: string;
    categoriasProdutos: string[];
    materiais: string[];
    servicos: string[];
    setores: string[];
    descricaoInstitucional: string;
    formaPagamento: string;
    cidade: string;
    estado: string;
    website?: string;
    redeSocial?: string;
  }) {
    const bcrypt = await import('bcrypt');
    const cpfDigits = this.normalizeCpf(data.cpf);
    const senhaHash = await bcrypt.hash(data.senha, 10);
    const cnpjDigits = data.cnpj.replace(/\D/g, '').slice(0, 14);
    const telefoneDigits = data.telefonePessoal.replace(/\D/g, '').slice(0, 11);
    const telefoneComercialDigits = data.telefoneComercial
      .replace(/\D/g, '')
      .slice(0, 11);

    return this.prisma.fornecedor.create({
      data: {
        cpf: cpfDigits,
        senhaHash,
        nomeCompleto: data.nomeCompleto,
        telefonePessoal: telefoneDigits,
        emailPessoal: data.emailPessoal,
        cnpj: cnpjDigits,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        website: data.website ?? null,
        redeSocial: data.redeSocial ?? null,
        emailComercial: data.emailComercial,
        telefoneComercial: telefoneComercialDigits,
        categoriasProdutos: data.categoriasProdutos,
        materiais: data.materiais,
        servicos: data.servicos,
        setores: data.setores,
        descricaoInstitucional: data.descricaoInstitucional,
        formaPagamento: data.formaPagamento,
        cidade: data.cidade,
        estado: data.estado,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = params.search?.trim();
    const categoria =
      params.categoria?.trim() &&
      CATEGORIAS_PRODUTOS.includes(params.categoria.trim())
        ? params.categoria.trim()
        : undefined;

    if (categoria) {
      const catJson = JSON.stringify([categoria]);
      const searchPattern = search ? `%${search}%` : null;

      const [rows, countRows] = await Promise.all([
        this.prisma.$queryRaw<FornecedorListagem[]>`
          SELECT id, nome_fantasia as "nomeFantasia",
            descricao_institucional as "descricaoInstitucional",
            categorias_produtos as "categoriasProdutos",
            materiais, servicos, setores, cidade, estado
          FROM fornecedores
          WHERE categorias_produtos::jsonb @> ${catJson}::jsonb
          ${
            searchPattern
              ? Prisma.sql`AND (nome_fantasia ILIKE ${searchPattern} OR descricao_institucional ILIKE ${searchPattern} OR razao_social ILIKE ${searchPattern})`
              : Prisma.empty
          }
          ORDER BY nome_fantasia ASC
          LIMIT ${limit}
          OFFSET ${skip}
        `,
        this.prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*)::bigint as count
          FROM fornecedores
          WHERE categorias_produtos::jsonb @> ${catJson}::jsonb
          ${
            searchPattern
              ? Prisma.sql`AND (nome_fantasia ILIKE ${searchPattern} OR descricao_institucional ILIKE ${searchPattern} OR razao_social ILIKE ${searchPattern})`
              : Prisma.empty
          }
        `,
      ]);

      const total = Number(countRows[0]?.count ?? 0);
      return {
        data: rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const where: Prisma.FornecedorWhereInput = {};
    if (search) {
      where.OR = [
        { nomeFantasia: { contains: search, mode: 'insensitive' } },
        { descricaoInstitucional: { contains: search, mode: 'insensitive' } },
        { razaoSocial: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [fornecedores, total] = await Promise.all([
      this.prisma.fornecedor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nomeFantasia: 'asc' },
        select: {
          id: true,
          nomeFantasia: true,
          descricaoInstitucional: true,
          categoriasProdutos: true,
          materiais: true,
          servicos: true,
          setores: true,
          cidade: true,
          estado: true,
        },
      }),
      this.prisma.fornecedor.count({ where }),
    ]);

    return {
      data: fornecedores,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
