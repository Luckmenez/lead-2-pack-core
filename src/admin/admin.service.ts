import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalCompradores,
      totalFornecedores,
      totalProfissionais,
      novosEsteMes,
      novosMesPassado,
      recentes,
    ] = await Promise.all([
      this.prisma.comprador.count(),
      this.prisma.fornecedor.count(),
      this.prisma.profissional.count(),
      this.prisma.comprador.count({ where: { createdAt: { gte: startOfMonth } } }).then(async (c) => {
        const f = await this.prisma.fornecedor.count({ where: { createdAt: { gte: startOfMonth } } });
        const p = await this.prisma.profissional.count({ where: { createdAt: { gte: startOfMonth } } });
        return c + f + p;
      }),
      this.prisma.comprador.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }).then(async (c) => {
        const f = await this.prisma.fornecedor.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } });
        const p = await this.prisma.profissional.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } });
        return c + f + p;
      }),
      this.getRecentes(5),
    ]);

    const totalUsuarios = totalCompradores + totalFornecedores + totalProfissionais;
    const variacaoMensal = novosMesPassado > 0
      ? Math.round(((novosEsteMes - novosMesPassado) / novosMesPassado) * 100)
      : null;

    return {
      totalUsuarios,
      totalCompradores,
      totalFornecedores,
      totalProfissionais,
      novosEsteMes,
      variacaoMensal,
      recentes,
    };
  }

  async getCadastros() {
    const [compradores, fornecedores, profissionais] = await Promise.all([
      this.prisma.comprador.findMany({
        select: { id: true, nomeCompleto: true, email: true, cnpj: true, razaoSocial: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fornecedor.findMany({
        select: { id: true, nomeFantasia: true, email: true, cnpj: true, razaoSocial: true, tipoEmpresa: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profissional.findMany({
        select: { id: true, nomeCompleto: true, emailPessoal: true, cpf: true, tipoEmpresa: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { compradores, fornecedores, profissionais };
  }

  async getColaboradores() {
    return this.prisma.collaborator.findMany({
      select: { id: true, email: true, nome: true, role: true, inviteAcceptedAt: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async convidarColaborador(email: string, nome: string, role: 'admin' | 'suporte') {
    const existente = await this.prisma.collaborator.findUnique({ where: { email } });
    if (existente) throw new ConflictException('Este e-mail já possui um colaborador cadastrado.');

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const collaborator = await this.prisma.collaborator.create({
      data: { email, nome, role, inviteToken },
    });

    const adminUrl = process.env.ADMIN_URL ?? 'http://localhost:3002';
    const inviteLink = `${adminUrl}/aceitar-convite?token=${inviteToken}`;
    await this.mail.sendCollaboratorInvite(email, nome, role, inviteLink);

    return { id: collaborator.id, email: collaborator.email, nome: collaborator.nome, role: collaborator.role };
  }

  async removerColaborador(id: string) {
    const found = await this.prisma.collaborator.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Colaborador não encontrado.');
    if (found.role === 'admin') {
      const admins = await this.prisma.collaborator.count({ where: { role: 'admin', inviteAcceptedAt: { not: null } } });
      if (admins <= 1) throw new BadRequestException('Não é possível remover o único administrador ativo.');
    }
    await this.prisma.collaborator.delete({ where: { id } });
    return { ok: true };
  }

  async getPlanos() {
    return this.prisma.plano.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async updatePlano(id: string, valor: number, limiteProdutos: number) {
    const found = await this.prisma.plano.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Plano não encontrado.');
    return this.prisma.plano.update({ where: { id }, data: { valor, limiteProdutos } });
  }

  async getPagamentos() {
    const assinaturas = await this.prisma.assinatura.findMany({
      where: { tipoUsuario: { not: 'Comprador' } },
      include: { plano: true },
      orderBy: { createdAt: 'desc' },
    });

    const compradorIds = assinaturas.filter((a) => a.tipoUsuario === 'Comprador').map((a) => a.usuarioId);
    const fornecedorIds = assinaturas.filter((a) => a.tipoUsuario === 'Fornecedor').map((a) => a.usuarioId);
    const profissionalIds = assinaturas.filter((a) => a.tipoUsuario === 'Profissional').map((a) => a.usuarioId);

    const [compradores, fornecedores, profissionais] = await Promise.all([
      compradorIds.length ? this.prisma.comprador.findMany({ where: { id: { in: compradorIds } }, select: { id: true, nomeCompleto: true } }) : [],
      fornecedorIds.length ? this.prisma.fornecedor.findMany({ where: { id: { in: fornecedorIds } }, select: { id: true, nomeFantasia: true } }) : [],
      profissionalIds.length ? this.prisma.profissional.findMany({ where: { id: { in: profissionalIds } }, select: { id: true, nomeCompleto: true } }) : [],
    ]);

    const nomeMap: Record<string, string> = {};
    compradores.forEach((c) => (nomeMap[c.id] = c.nomeCompleto));
    fornecedores.forEach((f) => (nomeMap[f.id] = f.nomeFantasia));
    profissionais.forEach((p) => (nomeMap[p.id] = p.nomeCompleto));

    const items = assinaturas.map((a) => ({
      id: a.id,
      usuario: nomeMap[a.usuarioId] ?? '—',
      tipo: a.tipoUsuario,
      plano: a.plano.nome,
      valor: Number(a.plano.valor),
      vencimento: a.vencimento,
      status: a.status,
    }));

    const compensados = items.filter((i) => i.status === 'Compensado');
    const pendentes = items.filter((i) => i.status === 'Pendente');
    const atrasados = items.filter((i) => i.status === 'Atrasado');

    return {
      items,
      totalReceita: compensados.reduce((s, i) => s + i.valor, 0),
      totalPendente: pendentes.reduce((s, i) => s + i.valor, 0),
      countPendente: pendentes.length,
      totalAtrasado: atrasados.reduce((s, i) => s + i.valor, 0),
      countAtrasado: atrasados.length,
    };
  }

  private async getRecentes(limit: number) {
    const [compradores, fornecedores, profissionais] = await Promise.all([
      this.prisma.comprador.findMany({
        select: { id: true, nomeCompleto: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.prisma.fornecedor.findMany({
        select: { id: true, nomeFantasia: true, email: true, tipoEmpresa: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.prisma.profissional.findMany({
        select: { id: true, nomeCompleto: true, emailPessoal: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ]);

    const todos = [
      ...compradores.map((c) => ({ id: c.id, nome: c.nomeCompleto, email: c.email, tipo: 'Comprador' as const, createdAt: c.createdAt })),
      ...fornecedores.map((f) => ({ id: f.id, nome: f.nomeFantasia, email: f.email, tipo: 'Fornecedor' as const, createdAt: f.createdAt })),
      ...profissionais.map((p) => ({ id: p.id, nome: p.nomeCompleto, email: p.emailPessoal, tipo: 'Profissional' as const, createdAt: p.createdAt })),
    ];

    return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
}
