import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as dns from 'dns';
import { promisify } from 'util';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const resolve4 = promisify(dns.resolve4);

export type ContactEmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  async onModuleInit() {
    const host = process.env.MAIL_HOST?.trim();
    const user = process.env.MAIL_USER?.trim();
    const pass = process.env.MAIL_PASSWORD?.trim();

    if (!host || !user || !pass) {
      this.logger.warn(
        'MAIL_HOST / MAIL_USER / MAIL_PASSWORD não definidos — envio desativado.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: await this.resolveToIPv4(host),
      port: parseInt(process.env.MAIL_PORT ?? '587', 10),
      secure: process.env.MAIL_SECURE === 'true',
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    } as any);
  }

  isConfigured(): boolean {
    return this.transporter != null;
  }

  async sendContactEmail(params: ContactEmailParams): Promise<void> {
    if (!this.transporter) {
      throw new ServiceUnavailableException(
        'Serviço de e-mail não configurado (variáveis MAIL_*).',
      );
    }

    const from =
      process.env.MAIL_FROM?.trim() || `Lead2Pack <${process.env.MAIL_USER}>`;

    await this.transporter.sendMail({ from, ...params });
    this.logger.log(`E-mail enviado para ${params.to}`);
  }

  buildContactBodyPlain(opts: {
    titulo: string;
    linhas: string[];
    mensagemOpcional?: string;
  }): { text: string; html: string } {
    const extra = opts.mensagemOpcional?.trim() ?? '';

    const text = [
      opts.titulo,
      '',
      opts.linhas.join('\n'),
      ...(extra ? ['', 'Mensagem adicional:', extra] : []),
      '',
      '— Mensagem automática Lead2Pack.',
    ].join('\n');

    const html = buildHtml(opts.titulo, opts.linhas, extra);

    return { text, html };
  }

  private async resolveToIPv4(host: string): Promise<string> {
    try {
      const [ipv4] = await resolve4(host);
      this.logger.log(`SMTP host resolvido para IPv4: ${ipv4}`);
      return ipv4;
    } catch {
      this.logger.warn(
        `Não foi possível resolver ${host} para IPv4, usando hostname original.`,
      );
      return host;
    }
  }
}

function buildHtml(
  titulo: string,
  linhas: string[],
  mensagemOpcional: string,
): string {
  const linhasHtml = linhas
    .map((l) => `<p style="margin:0 0 8px;">${escapeHtml(l)}</p>`)
    .join('');

  const mensagemHtml = mensagemOpcional
    ? `<p style="margin-top:16px;"><strong>Mensagem adicional:</strong><br/>${escapeHtml(mensagemOpcional)}</p>`
    : '';

  return `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#1a1a1a;">
  <p style="font-weight:600;margin:0 0 12px;">${escapeHtml(titulo)}</p>
  ${linhasHtml}
  ${mensagemHtml}
  <p style="margin-top:20px;font-size:13px;color:#666;">— Mensagem automática Lead2Pack</p>
</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
