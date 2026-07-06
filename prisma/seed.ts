import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = (senha: string) => bcrypt.hash(senha, 10);

  await prisma.collaborator.upsert({
    where: { email: 'admin@lead2pack.com.br' },
    update: {},
    create: {
      email: 'admin@lead2pack.com.br',
      senhaHash: await hash('admin123'),
      nome: 'Administrador',
      role: 'admin',
      inviteAcceptedAt: new Date(),
    },
  });

  await prisma.comprador.createMany({
    skipDuplicates: true,
    data: [
      {
        email: 'joao.silva@techsolutions.com.br',
        senhaHash: await hash('senha123'),
        nomeCompleto: 'João Silva',
        telefonePessoal: '11999990001',
        whatsappPessoal: '11999990001',
        cnpj: '12.345.678/0001-01',
        razaoSocial: 'Tech Solutions Ltda',
        nomeFantasia: 'TechSolutions',
        telefoneComercial: '1133330001',
        whatsappComercial: '11988880001',
        website: 'https://techsolutions.com.br',
      },
      {
        email: 'maria.santos@distribuidoraabc.com.br',
        senhaHash: await hash('senha123'),
        nomeCompleto: 'Maria Santos',
        telefonePessoal: '11999990002',
        whatsappPessoal: '11999990002',
        cnpj: '12.345.678/0001-02',
        razaoSocial: 'Distribuidora ABC Ltda',
        nomeFantasia: 'Distribuidora ABC',
        telefoneComercial: '1133330002',
        whatsappComercial: '11988880002',
      },
      {
        email: 'carlos.mendes@embalabem.com.br',
        senhaHash: await hash('senha123'),
        nomeCompleto: 'Carlos Mendes',
        telefonePessoal: '11999990003',
        whatsappPessoal: '11999990003',
        cnpj: '12.345.678/0001-03',
        razaoSocial: 'Embala Bem Comércio Ltda',
        nomeFantasia: 'EmbalaBem',
        telefoneComercial: '1133330003',
        whatsappComercial: '11988880003',
        website: 'https://embalabem.com.br',
      },
    ],
  });

  await prisma.fornecedor.createMany({
    skipDuplicates: true,
    data: [
      {
        email: 'contato@plasticosverde.com.br',
        senhaHash: await hash('senha123'),
        telefone: '1144440001',
        whatsapp: '11977770001',
        cnpj: '98.765.432/0001-01',
        razaoSocial: 'Plásticos Verde Indústria Ltda',
        nomeFantasia: 'PlásticosVerde',
        website: 'https://plasticosverde.com.br',
        redeSocial: 'instagram.com/plasticosverde',
        cidade: 'São Paulo',
        estado: 'SP',
        tipoInscricao: 'estadual',
        numeroInscricao: '111.222.333.444',
        tipoEmpresa: 'simples_nacional',
        categoriasProdutos: ['Embalagens Plásticas', 'Sacolas'],
        descricaoInstitucional: 'Fabricante de embalagens plásticas sustentáveis há 15 anos.',
        portfolioUrls: [],
        formaPagamento: 'boleto',
      },
      {
        email: 'vendas@papelariaprime.com.br',
        senhaHash: await hash('senha123'),
        telefone: '1144440002',
        whatsapp: '11977770002',
        cnpj: '98.765.432/0001-02',
        razaoSocial: 'Papelaria Prime Distribuidora Ltda',
        nomeFantasia: 'PapelariaP rime',
        website: 'https://papelariaprime.com.br',
        redeSocial: 'linkedin.com/company/papelaria-prime',
        cidade: 'Campinas',
        estado: 'SP',
        tipoInscricao: 'estadual',
        numeroInscricao: '222.333.444.555',
        tipoEmpresa: 'lucro_presumido',
        categoriasProdutos: ['Caixas de Papelão', 'Papel Kraft'],
        descricaoInstitucional: 'Distribuidor de embalagens de papel e papelão para todo o Brasil.',
        portfolioUrls: [],
        formaPagamento: 'pix',
      },
      {
        email: 'comercial@madeirart.com.br',
        senhaHash: await hash('senha123'),
        telefone: '1144440003',
        whatsapp: '11977770003',
        cnpj: '98.765.432/0001-03',
        razaoSocial: 'Madeirart Embalagens ME',
        nomeFantasia: 'Madeirart',
        website: '',
        redeSocial: '',
        cidade: 'Ribeirão Preto',
        estado: 'SP',
        tipoInscricao: 'municipal',
        numeroInscricao: '333.444.555.666',
        tipoEmpresa: 'mei',
        categoriasProdutos: ['Caixas de Madeira', 'Pallets'],
        descricaoInstitucional: 'Produção artesanal de caixas de madeira para presentes e transporte.',
        portfolioUrls: [],
        formaPagamento: 'pix',
      },
    ],
  });

  await prisma.profissional.createMany({
    skipDuplicates: true,
    data: [
      {
        cpf: '111.222.333-01',
        senhaHash: await hash('senha123'),
        nomeCompleto: 'Ana Paula Ferreira',
        apelido: 'AnaDesign',
        telefonePessoal: '11955550001',
        whatsappPessoal: '11955550001',
        emailPessoal: 'ana.ferreira@design.com',
        tipoEmpresa: 'mei',
        categoriasProdutos: ['Design de Embalagens', 'Branding'],
        descricaoInstitucional: 'Designer especializada em identidade visual e embalagens sustentáveis.',
        portfolioUrls: [],
        formaPagamento: 'pix',
        website: 'https://anadesign.com.br',
      },
      {
        cpf: '111.222.333-02',
        senhaHash: await hash('senha123'),
        nomeCompleto: 'Roberto Lima',
        apelido: 'RobertoConsult',
        telefonePessoal: '11955550002',
        whatsappPessoal: '11955550002',
        emailPessoal: 'roberto.lima@consult.com',
        tipoEmpresa: 'simples_nacional',
        categoriasProdutos: ['Consultoria Logística', 'Supply Chain'],
        descricaoInstitucional: 'Consultor de logística com 10 anos de experiência em supply chain.',
        portfolioUrls: [],
        formaPagamento: 'boleto',
      },
    ],
  });

  // Planos
  const basico = await prisma.plano.upsert({
    where: { nome: 'Básico' },
    update: {},
    create: { nome: 'Básico', valor: 100 },
  });
  for (const nome of ['Inicial', 'Profissional', 'Premium']) {
    await prisma.plano.upsert({
      where: { nome },
      update: {},
      create: { nome, valor: 0 },
    });
  }

  // Assinaturas — todos no Básico, Pendente
  const vencimento = new Date();
  vencimento.setMonth(vencimento.getMonth() + 1);

  const [compradores, fornecedores, profissionais] = await Promise.all([
    prisma.comprador.findMany({ select: { id: true } }),
    prisma.fornecedor.findMany({ select: { id: true } }),
    prisma.profissional.findMany({ select: { id: true } }),
  ]);

  for (const f of fornecedores) {
    await prisma.assinatura.upsert({
      where: { usuarioId_tipoUsuario: { usuarioId: f.id, tipoUsuario: 'Fornecedor' } },
      update: {},
      create: { planoId: basico.id, usuarioId: f.id, tipoUsuario: 'Fornecedor', status: 'Pendente', vencimento },
    });
  }
  for (const p of profissionais) {
    await prisma.assinatura.upsert({
      where: { usuarioId_tipoUsuario: { usuarioId: p.id, tipoUsuario: 'Profissional' } },
      update: {},
      create: { planoId: basico.id, usuarioId: p.id, tipoUsuario: 'Profissional', status: 'Pendente', vencimento },
    });
  }

  console.log('✓ Seed concluído');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
