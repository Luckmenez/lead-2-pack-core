import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompradorService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.comprador.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.comprador.findUnique({ where: { id } });
  }

  async create(data: {
    email: string;
    senha: string;
    nomeCompleto: string;
    telefonePessoal: string;
    whatsappPessoal: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    telefoneComercial: string;
    whatsappComercial: string;
    website?: string;
    redeSocial?: string;
  }) {
    const bcrypt = await import('bcrypt');
    const senhaHash = await bcrypt.hash(data.senha, 10);
    const cnpjDigits = data.cnpj.replace(/\D/g, '').slice(0, 14);
    const telefoneDigits = data.telefonePessoal.replace(/\D/g, '').slice(0, 11);
    const whatsappPessoalDigits = data.whatsappPessoal
      .replace(/\D/g, '')
      .slice(0, 11);
    const telefoneComercialDigits = data.telefoneComercial
      .replace(/\D/g, '')
      .slice(0, 11);
    const whatsappComercialDigits = data.whatsappComercial
      .replace(/\D/g, '')
      .slice(0, 11);

    return this.prisma.comprador.create({
      data: {
        email: data.email,
        senhaHash,
        nomeCompleto: data.nomeCompleto,
        telefonePessoal: telefoneDigits,
        whatsappPessoal: whatsappPessoalDigits,
        cnpj: cnpjDigits,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia ?? null,
        telefoneComercial: telefoneComercialDigits,
        whatsappComercial: whatsappComercialDigits,
        website: data.website ?? null,
        redeSocial: data.redeSocial ?? null,
      },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = params.search?.trim();

    const where: Prisma.CompradorWhereInput = {};
    if (search) {
      where.OR = [
        { nomeFantasia: { contains: search, mode: 'insensitive' } },
        { razaoSocial: { contains: search, mode: 'insensitive' } },
        { nomeCompleto: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.comprador.findMany({
        where,
        skip,
        take: limit,
        orderBy: { razaoSocial: 'asc' },
        select: {
          id: true,
          razaoSocial: true,
          nomeFantasia: true,
          website: true,
          redeSocial: true,
        },
      }),
      this.prisma.comprador.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
