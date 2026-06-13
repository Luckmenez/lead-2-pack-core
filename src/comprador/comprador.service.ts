import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findMe(id: string) {
    return this.prisma.comprador.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nomeCompleto: true,
        telefonePessoal: true,
        whatsappPessoal: true,
        cnpj: true,
        razaoSocial: true,
        nomeFantasia: true,
        telefoneComercial: true,
        whatsappComercial: true,
        website: true,
        redeSocial: true,
        createdAt: true,
      },
    });
  }

  async updateMe(
    id: string,
    data: {
      nomeCompleto?: string;
      email?: string;
      telefonePessoal?: string;
      whatsappPessoal?: string;
      telefoneComercial?: string;
      whatsappComercial?: string;
      razaoSocial?: string;
      nomeFantasia?: string | null;
      website?: string;
      redeSocial?: string;
    },
  ) {
    const updateData: Prisma.CompradorUpdateInput = {};

    if (data.nomeCompleto !== undefined)
      updateData.nomeCompleto = data.nomeCompleto;
    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();
      const existente = await this.prisma.comprador.findFirst({
        where: { email, NOT: { id } },
      });
      if (existente) {
        throw new ConflictException('E-mail já cadastrado');
      }
      updateData.email = email;
    }
    if (data.telefonePessoal !== undefined)
      updateData.telefonePessoal = data.telefonePessoal
        .replace(/\D/g, '')
        .slice(0, 11);
    if (data.whatsappPessoal !== undefined)
      updateData.whatsappPessoal = data.whatsappPessoal
        .replace(/\D/g, '')
        .slice(0, 11);
    if (data.telefoneComercial !== undefined)
      updateData.telefoneComercial = data.telefoneComercial
        .replace(/\D/g, '')
        .slice(0, 11);
    if (data.whatsappComercial !== undefined)
      updateData.whatsappComercial = data.whatsappComercial
        .replace(/\D/g, '')
        .slice(0, 11);
    if (data.razaoSocial !== undefined)
      updateData.razaoSocial = data.razaoSocial;
    if (data.nomeFantasia !== undefined)
      updateData.nomeFantasia = data.nomeFantasia;
    if (data.website !== undefined) updateData.website = data.website || null;
    if (data.redeSocial !== undefined)
      updateData.redeSocial = data.redeSocial || null;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Ao menos um campo deve ser informado para atualização',
      );
    }

    try {
      return await this.prisma.comprador.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          nomeCompleto: true,
          telefonePessoal: true,
          whatsappPessoal: true,
          cnpj: true,
          razaoSocial: true,
          nomeFantasia: true,
          telefoneComercial: true,
          whatsappComercial: true,
          website: true,
          redeSocial: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e?.code === 'P2025')
        throw new NotFoundException('Comprador não encontrado');
      throw e;
    }
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = params.search?.trim();

    const where: Prisma.CompradorWhereInput = {};
    if (search) {
      where.OR = [
        { nomeFantasia: { startsWith: search, mode: 'insensitive' } },
        { razaoSocial: { startsWith: search, mode: 'insensitive' } },
        { nomeCompleto: { startsWith: search, mode: 'insensitive' } },
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
