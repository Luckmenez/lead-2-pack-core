import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompradorService } from '../comprador/comprador.service';
import { FornecedorService } from '../fornecedor/fornecedor.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { MailService } from '../mail/mail.service';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class ContatoService {
  constructor(
    private readonly compradorService: CompradorService,
    private readonly fornecedorService: FornecedorService,
    private readonly profissionalService: ProfissionalService,
    private readonly mailService: MailService,
  ) {}

  async compradorParaFornecedor(
    user: JwtPayload,
    fornecedorId: string,
    mensagem?: string,
  ) {
    if (user.tipo !== 'comprador') {
      throw new ForbiddenException(
        'Apenas compradores podem solicitar contato com fornecedores.',
      );
    }
    const comprador = await this.compradorService.findById(user.sub);
    if (!comprador) {
      throw new NotFoundException('Comprador não encontrado.');
    }
    const fornecedor = await this.fornecedorService.findById(fornecedorId);
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }
    const { text, html } = this.mailService.buildContactBodyPlain({
      titulo: 'Novo interesse de contato — Lead2Pack',
      linhas: [
        `Um comprador demonstrou interesse em falar com sua empresa.`,
        `Comprador: ${comprador.nomeCompleto} (${comprador.razaoSocial})`,
        `E-mail para resposta: ${comprador.email}`,
        `Fornecedor: ${fornecedor.nomeFantasia}`,
      ],
      mensagemOpcional: mensagem,
    });
    await this.mailService.sendContactEmail({
      to: fornecedor.email,
      subject: `[Lead2Pack] Contato de ${comprador.nomeCompleto}`,
      text,
      html,
      replyTo: comprador.email,
    });
    return { enviado: true };
  }

  async paraComprador(
    user: JwtPayload,
    compradorId: string,
    mensagem?: string,
  ) {
    if (user.tipo !== 'fornecedor' && user.tipo !== 'profissional') {
      throw new ForbiddenException(
        'Apenas fornecedores ou profissionais podem solicitar contato com compradores.',
      );
    }
    const comprador = await this.compradorService.findById(compradorId);
    if (!comprador) {
      throw new NotFoundException('Comprador não encontrado.');
    }
    let linhas: string[];
    let replyTo: string;
    let assuntoNome: string;
    if (user.tipo === 'fornecedor') {
      const f = await this.fornecedorService.findById(user.sub);
      if (!f) throw new NotFoundException('Fornecedor não encontrado.');
      replyTo = f.email;
      assuntoNome = f.nomeFantasia;
      linhas = [
        `Um fornecedor deseja entrar em contato com sua empresa.`,
        `Fornecedor: ${f.nomeFantasia} (${f.razaoSocial})`,
        `E-mail para resposta: ${f.email}`,
        `Comprador: ${comprador.nomeCompleto} (${comprador.razaoSocial})`,
      ];
    } else {
      const p = await this.profissionalService.findById(user.sub);
      if (!p) throw new NotFoundException('Profissional não encontrado.');
      replyTo = p.emailPessoal;
      assuntoNome = p.apelido;
      linhas = [
        `Um profissional do setor deseja entrar em contato com sua empresa.`,
        `Profissional: ${p.nomeCompleto} (${p.apelido})`,
        `E-mail para resposta: ${p.emailPessoal}`,
        `Comprador: ${comprador.nomeCompleto} (${comprador.razaoSocial})`,
      ];
    }
    const { text, html } = this.mailService.buildContactBodyPlain({
      titulo: 'Novo interesse de contato — Lead2Pack',
      linhas,
      mensagemOpcional: mensagem,
    });
    await this.mailService.sendContactEmail({
      to: comprador.email,
      subject: `[Lead2Pack] Contato de ${assuntoNome}`,
      text,
      html,
      replyTo,
    });
    return { enviado: true };
  }

  async paraProfissional(
    user: JwtPayload,
    profissionalId: string,
    mensagem?: string,
  ) {
    if (user.tipo !== 'comprador' && user.tipo !== 'fornecedor') {
      throw new ForbiddenException(
        'Apenas compradores ou fornecedores podem solicitar contato com profissionais.',
      );
    }
    const profissional =
      await this.profissionalService.findById(profissionalId);
    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado.');
    }
    let linhas: string[];
    let replyTo: string;
    let assuntoNome: string;
    if (user.tipo === 'comprador') {
      const c = await this.compradorService.findById(user.sub);
      if (!c) throw new NotFoundException('Comprador não encontrado.');
      replyTo = c.email;
      assuntoNome = c.nomeCompleto;
      linhas = [
        `Um comprador demonstrou interesse em falar com você.`,
        `Comprador: ${c.nomeCompleto} (${c.razaoSocial})`,
        `E-mail para resposta: ${c.email}`,
        `Profissional: ${profissional.nomeCompleto} (${profissional.apelido})`,
      ];
    } else {
      const f = await this.fornecedorService.findById(user.sub);
      if (!f) throw new NotFoundException('Fornecedor não encontrado.');
      replyTo = f.email;
      assuntoNome = f.nomeFantasia;
      linhas = [
        `Um fornecedor demonstrou interesse em falar com você.`,
        `Fornecedor: ${f.nomeFantasia} (${f.razaoSocial})`,
        `E-mail para resposta: ${f.email}`,
        `Profissional: ${profissional.nomeCompleto} (${profissional.apelido})`,
      ];
    }
    const { text, html } = this.mailService.buildContactBodyPlain({
      titulo: 'Novo interesse de contato — Lead2Pack',
      linhas,
      mensagemOpcional: mensagem,
    });
    await this.mailService.sendContactEmail({
      to: profissional.emailPessoal,
      subject: `[Lead2Pack] Contato de ${assuntoNome}`,
      text,
      html,
      replyTo,
    });
    return { enviado: true };
  }
}
