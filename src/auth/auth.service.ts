import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CompradorService } from '../comprador/comprador.service';
import { FornecedorService } from '../fornecedor/fornecedor.service';
import { ProfissionalService } from '../profissional/profissional.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly compradorService: CompradorService,
    private readonly fornecedorService: FornecedorService,
    private readonly profissionalService: ProfissionalService,
    private readonly jwtService: JwtService,
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

  async loginComprador(email: string, senha: string) {
    const comprador = await this.compradorService.findByEmail(email);

    if (!comprador) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(senha, comprador.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

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
    materiais: string[];
    servicos: string[];
    setores: string[];
    descricaoInstitucional: string;
    formaPagamento: string;
  }) {
    const existente = await this.fornecedorService.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
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
    if (comprador) {
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

    const fornecedor = await this.fornecedorService.findByEmail(email);
    if (fornecedor) {
      const senhaValida = await bcrypt.compare(senha, fornecedor.senhaHash);
      if (senhaValida) {
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
    }

    throw new UnauthorizedException('E-mail ou senha inválidos');
  }

  async loginFornecedor(email: string, senha: string) {
    const fornecedor = await this.fornecedorService.findByEmail(email);
    if (!fornecedor) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    const senhaValida = await bcrypt.compare(senha, fornecedor.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
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
    categoriasProdutos: string[];
    materiais: string[];
    servicos: string[];
    setores: string[];
    descricaoInstitucional: string;
    formaPagamento: string;
  }) {
    const existente = await this.profissionalService.findByCpf(dto.cpf);
    if (existente) {
      throw new ConflictException('CPF já cadastrado');
    }
    const profissional = await this.profissionalService.create(dto);
    const payload = { sub: profissional.id, cpf: profissional.cpf, tipo: 'profissional' };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      profissional: {
        id: profissional.id,
        nomeCompleto: profissional.nomeCompleto,
        cpf: profissional.cpf,
        emailPessoal: profissional.emailPessoal,
      },
    };
  }
}
