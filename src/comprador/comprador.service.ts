import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompradorService {
  constructor(private readonly prisma: PrismaService) {}

  normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '').slice(0, 11);
  }

  async findByCpf(cpf: string) {
    const cpfDigits = this.normalizeCpf(cpf);
    return this.prisma.comprador.findUnique({
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
    emailComercial: string;
    telefoneComercial: string;
    nomeFantasia?: string;
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

    return this.prisma.comprador.create({
      data: {
        cpf: cpfDigits,
        senhaHash,
        nomeCompleto: data.nomeCompleto,
        telefonePessoal: telefoneDigits,
        emailPessoal: data.emailPessoal,
        cnpj: cnpjDigits,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia ?? null,
        website: data.website ?? null,
        redeSocial: data.redeSocial ?? null,
        emailComercial: data.emailComercial,
        telefoneComercial: telefoneComercialDigits,
      },
    });
  }
}
