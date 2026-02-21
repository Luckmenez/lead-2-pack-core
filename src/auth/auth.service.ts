import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CompradorService } from '../comprador/comprador.service';
import { FornecedorService } from '../fornecedor/fornecedor.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly compradorService: CompradorService,
    private readonly fornecedorService: FornecedorService,
    private readonly jwtService: JwtService,
  ) {}

  async registerComprador(dto: {
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
    const existente = await this.compradorService.findByCpf(dto.cpf);
    if (existente) {
      throw new ConflictException('CPF já cadastrado');
    }
    const comprador = await this.compradorService.create(dto);
    const payload = { sub: comprador.id, cpf: comprador.cpf, tipo: 'comprador' };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      comprador: {
        id: comprador.id,
        nomeCompleto: comprador.nomeCompleto,
        cpf: comprador.cpf,
        emailPessoal: comprador.emailPessoal,
      },
    };
  }

  async loginComprador(cpf: string, senha: string) {
    const comprador = await this.compradorService.findByCpf(cpf);

    if (!comprador) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(senha, comprador.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    const payload = {
      sub: comprador.id,
      cpf: comprador.cpf,
      tipo: 'comprador',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      comprador: {
        id: comprador.id,
        nomeCompleto: comprador.nomeCompleto,
        cpf: comprador.cpf,
        emailPessoal: comprador.emailPessoal,
      },
    };
  }

  async registerFornecedor(dto: {
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
    website?: string;
    redeSocial?: string;
  }) {
    const existente = await this.fornecedorService.findByCpf(dto.cpf);
    if (existente) {
      throw new ConflictException('CPF já cadastrado');
    }
    const fornecedor = await this.fornecedorService.create(dto);
    const payload = {
      sub: fornecedor.id,
      cpf: fornecedor.cpf,
      tipo: 'fornecedor',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      fornecedor: {
        id: fornecedor.id,
        nomeCompleto: fornecedor.nomeCompleto,
        cpf: fornecedor.cpf,
        emailPessoal: fornecedor.emailPessoal,
        nomeFantasia: fornecedor.nomeFantasia,
      },
    };
  }

  async login(cpf: string, senha: string) {
    const comprador = await this.compradorService.findByCpf(cpf);
    if (comprador) {
      const senhaValida = await bcrypt.compare(senha, comprador.senhaHash);
      if (senhaValida) {
        const payload = {
          sub: comprador.id,
          cpf: comprador.cpf,
          tipo: 'comprador',
        };
        const accessToken = this.jwtService.sign(payload);
        return {
          accessToken,
          tipo: 'comprador' as const,
          comprador: {
            id: comprador.id,
            nomeCompleto: comprador.nomeCompleto,
            cpf: comprador.cpf,
            emailPessoal: comprador.emailPessoal,
          },
        };
      }
    }

    const fornecedor = await this.fornecedorService.findByCpf(cpf);
    if (fornecedor) {
      const senhaValida = await bcrypt.compare(senha, fornecedor.senhaHash);
      if (senhaValida) {
        const payload = {
          sub: fornecedor.id,
          cpf: fornecedor.cpf,
          tipo: 'fornecedor',
        };
        const accessToken = this.jwtService.sign(payload);
        return {
          accessToken,
          tipo: 'fornecedor' as const,
          fornecedor: {
            id: fornecedor.id,
            nomeCompleto: fornecedor.nomeCompleto,
            cpf: fornecedor.cpf,
            emailPessoal: fornecedor.emailPessoal,
            nomeFantasia: fornecedor.nomeFantasia,
          },
        };
      }
    }

    throw new UnauthorizedException('CPF ou senha inválidos');
  }

  async loginFornecedor(cpf: string, senha: string) {
    const fornecedor = await this.fornecedorService.findByCpf(cpf);
    if (!fornecedor) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }
    const senhaValida = await bcrypt.compare(senha, fornecedor.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }
    const payload = {
      sub: fornecedor.id,
      cpf: fornecedor.cpf,
      tipo: 'fornecedor',
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      fornecedor: {
        id: fornecedor.id,
        nomeCompleto: fornecedor.nomeCompleto,
        cpf: fornecedor.cpf,
        emailPessoal: fornecedor.emailPessoal,
        nomeFantasia: fornecedor.nomeFantasia,
      },
    };
  }
}
