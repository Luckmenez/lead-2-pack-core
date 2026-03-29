import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompradorService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.comprador.findUnique({ where: { email } });
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
    const whatsappPessoalDigits = data.whatsappPessoal.replace(/\D/g, '').slice(0, 11);
    const telefoneComercialDigits = data.telefoneComercial.replace(/\D/g, '').slice(0, 11);
    const whatsappComercialDigits = data.whatsappComercial.replace(/\D/g, '').slice(0, 11);

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
}
