import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CompradorService } from '../comprador/comprador.service';
import { FornecedorService } from '../fornecedor/fornecedor.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { PerfilLoginSelecao } from './dto/login-selecionar-perfil.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly compradorService: CompradorService,
    private readonly fornecedorService: FornecedorService,
    private readonly profissionalService: ProfissionalService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async registerComprador(dto: {
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
    const existente = await this.compradorService.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const profissionalComEmail =
      await this.profissionalService.findByEmailPessoal(dto.email);
    if (profissionalComEmail) {
      throw new ConflictException(
        'Este e-mail já está cadastrado como profissional. Profissional não pode compartilhar e-mail com comprador ou fornecedor.',
      );
    }
    const fornecedorMesmoEmail = await this.fornecedorService.findByEmail(
      dto.email,
    );
    if (fornecedorMesmoEmail) {
      const senhaConfere = await bcrypt.compare(
        dto.senha,
        fornecedorMesmoEmail.senhaHash,
      );
      if (!senhaConfere) {
        throw new BadRequestException(
          'Este e-mail já possui cadastro como fornecedor. Use a mesma senha para vincular o perfil de comprador.',
        );
      }
    }
    const comprador = await this.compradorService.create(dto);
    const payload = {
      sub: comprador.id,
      email: comprador.email,
      tipo: 'comprador',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      comprador: {
        id: comprador.id,
        nomeCompleto: comprador.nomeCompleto,
        email: comprador.email,
      },
    };
  }

  async registerFornecedor(dto: {
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
    descricaoInstitucional: string;
    portfolioUrls?: string[];
    formaPagamento: string;
  }) {
    const existente = await this.fornecedorService.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const profissionalComEmail =
      await this.profissionalService.findByEmailPessoal(dto.email);
    if (profissionalComEmail) {
      throw new ConflictException(
        'Este e-mail já está cadastrado como profissional. Profissional não pode compartilhar e-mail com comprador ou fornecedor.',
      );
    }
    const compradorMesmoEmail = await this.compradorService.findByEmail(
      dto.email,
    );
    if (compradorMesmoEmail) {
      const senhaConfere = await bcrypt.compare(
        dto.senha,
        compradorMesmoEmail.senhaHash,
      );
      if (!senhaConfere) {
        throw new BadRequestException(
          'Este e-mail já possui cadastro como comprador. Use a mesma senha para vincular o perfil de fornecedor.',
        );
      }
    }
    const fornecedor = await this.fornecedorService.create(dto);
    const payload = {
      sub: fornecedor.id,
      email: fornecedor.email,
      tipo: 'fornecedor',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      fornecedor: {
        id: fornecedor.id,
        email: fornecedor.email,
        nomeFantasia: fornecedor.nomeFantasia,
      },
    };
  }

  async login(email: string, senha: string) {
    const comprador = await this.compradorService.findByEmail(email);
    const fornecedor = await this.fornecedorService.findByEmail(email);

    if (comprador && fornecedor) {
      const senhaComprador = await bcrypt.compare(senha, comprador.senhaHash);
      const senhaFornecedor = await bcrypt.compare(senha, fornecedor.senhaHash);
      if (senhaComprador && senhaFornecedor) {
        return {
          precisaEscolherPerfil: true as const,
          perfisDisponiveis: ['comprador', 'fornecedor'] as const,
          comprador: {
            id: comprador.id,
            nomeCompleto: comprador.nomeCompleto,
            email: comprador.email,
          },
          fornecedor: {
            id: fornecedor.id,
            email: fornecedor.email,
            nomeFantasia: fornecedor.nomeFantasia,
          },
        };
      }
      if (senhaComprador && !senhaFornecedor) {
        return this.emitirLoginComprador(comprador);
      }
      if (!senhaComprador && senhaFornecedor) {
        return this.emitirLoginFornecedor(fornecedor);
      }
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (comprador) {
      const senhaValida = await bcrypt.compare(senha, comprador.senhaHash);
      if (!senhaValida) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
      return this.emitirLoginComprador(comprador);
    }

    if (fornecedor) {
      const senhaValida = await bcrypt.compare(senha, fornecedor.senhaHash);
      if (!senhaValida) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
      return this.emitirLoginFornecedor(fornecedor);
    }

    const profissional =
      await this.profissionalService.findByEmailPessoal(email);
    if (profissional) {
      const senhaValida = await bcrypt.compare(senha, profissional.senhaHash);
      if (!senhaValida) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
      return this.emitirLoginProfissional(profissional);
    }

    throw new UnauthorizedException('E-mail ou senha inválidos');
  }

  async loginSelecionarPerfil(
    email: string,
    senha: string,
    perfil: PerfilLoginSelecao,
  ) {
    const comprador = await this.compradorService.findByEmail(email);
    const fornecedor = await this.fornecedorService.findByEmail(email);
    if (!comprador || !fornecedor) {
      throw new BadRequestException(
        'Este e-mail não possui os dois perfis (comprador e fornecedor). Use o login normal.',
      );
    }
    if (perfil === PerfilLoginSelecao.comprador) {
      const senhaValida = await bcrypt.compare(senha, comprador.senhaHash);
      if (!senhaValida) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
      return this.emitirLoginComprador(comprador);
    }
    const senhaValida = await bcrypt.compare(senha, fornecedor.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    return this.emitirLoginFornecedor(fornecedor);
  }

  private emitirLoginComprador(comprador: {
    id: string;
    email: string;
    nomeCompleto: string;
    senhaHash: string;
  }) {
    const payload = {
      sub: comprador.id,
      email: comprador.email,
      tipo: 'comprador',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      tipo: 'comprador' as const,
      comprador: {
        id: comprador.id,
        nomeCompleto: comprador.nomeCompleto,
        email: comprador.email,
      },
    };
  }

  private emitirLoginFornecedor(fornecedor: {
    id: string;
    email: string;
    nomeFantasia: string;
    senhaHash: string;
  }) {
    const payload = {
      sub: fornecedor.id,
      email: fornecedor.email,
      tipo: 'fornecedor',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      tipo: 'fornecedor' as const,
      fornecedor: {
        id: fornecedor.id,
        email: fornecedor.email,
        nomeFantasia: fornecedor.nomeFantasia,
      },
    };
  }

  private emitirLoginProfissional(profissional: {
    id: string;
    emailPessoal: string;
    nomeCompleto: string;
    apelido: string;
    senhaHash: string;
  }) {
    const payload = {
      sub: profissional.id,
      email: profissional.emailPessoal,
      tipo: 'profissional',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      tipo: 'profissional' as const,
      profissional: {
        id: profissional.id,
        nomeCompleto: profissional.nomeCompleto,
        apelido: profissional.apelido,
        emailPessoal: profissional.emailPessoal,
      },
    };
  }

  async solicitarRecuperacaoSenha(email: string): Promise<void> {
    const emailNorm = email.trim().toLowerCase();

    const [comprador, fornecedor, profissional] = await Promise.all([
      this.compradorService.findByEmail(emailNorm),
      this.fornecedorService.findByEmail(emailNorm),
      this.profissionalService.findByEmailPessoal(emailNorm),
    ]);

    // Retorna genérico para não vazar se e-mail existe
    if (!comprador && !fornecedor && !profissional) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.prisma.passwordResetToken.create({
      data: { token, email: emailNorm, expiresAt },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailService.sendPasswordResetEmail(emailNorm, resetLink);
  }

  async redefinirSenha(token: string, novaSenha: string): Promise<void> {
    const registro = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!registro) {
      throw new NotFoundException('Token inválido ou expirado');
    }
    if (registro.usedAt) {
      throw new BadRequestException('Este link já foi utilizado');
    }
    if (registro.expiresAt < new Date()) {
      throw new BadRequestException('Este link expirou. Solicite um novo.');
    }

    const email = registro.email;
    const novoHash = await bcrypt.hash(novaSenha, 10);

    const [comprador, fornecedor, profissional] = await Promise.all([
      this.compradorService.findByEmail(email),
      this.fornecedorService.findByEmail(email),
      this.profissionalService.findByEmailPessoal(email),
    ]);

    if (!comprador && !fornecedor && !profissional) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await Promise.all([
      comprador
        ? this.prisma.comprador.update({
            where: { id: comprador.id },
            data: { senhaHash: novoHash },
          })
        : null,
      fornecedor
        ? this.prisma.fornecedor.update({
            where: { id: fornecedor.id },
            data: { senhaHash: novoHash },
          })
        : null,
      profissional
        ? this.prisma.profissional.update({
            where: { id: profissional.id },
            data: { senhaHash: novoHash },
          })
        : null,
    ]);

    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  }

  async registerProfissional(dto: {
    cpf: string;
    senha: string;
    nomeCompleto: string;
    apelido: string;
    telefonePessoal: string;
    whatsappPessoal: string;
    emailPessoal: string;
    website?: string;
    redeSocial?: string;
    tipoEmpresa: string;
    categoriasProdutos: string[];
    descricaoInstitucional: string;
    portfolioUrls?: string[];
    formaPagamento: string;
  }) {
    const existente = await this.profissionalService.findByCpf(dto.cpf);
    if (existente) {
      throw new ConflictException('CPF já cadastrado');
    }
    const emailProfissional = dto.emailPessoal.trim();
    const [compradorComEmail, fornecedorComEmail] = await Promise.all([
      this.compradorService.findByEmail(emailProfissional),
      this.fornecedorService.findByEmail(emailProfissional),
    ]);
    if (compradorComEmail || fornecedorComEmail) {
      throw new ConflictException(
        'Este e-mail já está em uso como comprador ou fornecedor. O perfil profissional não pode compartilhar o mesmo e-mail.',
      );
    }
    const profissional = await this.profissionalService.create({
      ...dto,
      emailPessoal: emailProfissional,
    });
    const payload = {
      sub: profissional.id,
      email: profissional.emailPessoal,
      tipo: 'profissional',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      profissional: {
        id: profissional.id,
        nomeCompleto: profissional.nomeCompleto,
        apelido: profissional.apelido,
        emailPessoal: profissional.emailPessoal,
      },
    };
  }
}
