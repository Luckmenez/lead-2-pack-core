import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CompradorService } from '../comprador/comprador.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly compradorService: CompradorService,
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
}
