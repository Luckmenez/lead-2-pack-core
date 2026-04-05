import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export type ContactEmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor() {
    const host = process.env.MAIL_HOST?.trim();
    const user = process.env.MAIL_USER?.trim();
    const pass = process.env.MAIL_PASSWORD?.trim();
    if (!host || !user || !pass) {
      this.logger.warn(
        'MAIL_HOST / MAIL_USER / MAIL_PASSWORD não definidos — envio de e-mail desativado até configurar.',
      );
      return;
    }
    const port = parseInt(process.env.MAIL_PORT ?? '587', 10);
    const secure = process.env.MAIL_SECURE === 'true';
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      ...(port === 587 && !secure ? { requireTLS: true } : {}),
    });
  }

  isConfigured(): boolean {
    return this.transporter != null;
  }

  async sendContactEmail(params: ContactEmailParams): Promise<void> {
    if (!this.transporter) {
      throw new ServiceUnavailableException(
        'Envio de e-mail não está configurado no servidor (variáveis MAIL_*).',
      );
    }
    const from =
      process.env.MAIL_FROM?.trim() ||
      `Lead2Pack <${process.env.MAIL_USER}>`;
    await this.transporter.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: params.replyTo,
    });
    this.logger.log(`E-mail de contato enviado para ${params.to}`);
  }

  /** Template provisório até haver layout/HTML definitivo. */
  buildContactBodyPlain(opts: {
    titulo: string;
    linhas: string[];
    mensagemOpcional?: string;
  }): { text: string; html: string } {
    const bloco = opts.linhas.join('\n');
    const extra = opts.mensagemOpcional?.trim()
      ? `\n\nMensagem adicional:\n${opts.mensagemOpcional.trim()}`
      : '';
    const text = `${opts.titulo}\n\n${bloco}${extra}\n\n—\nMensagem automática Lead2Pack.`;
    const htmlLinhas = opts.linhas
      .map((l) => `<p style="margin:0 0 8px;">${escapeHtml(l)}</p>`)
      .join('');
    const msgHtml = opts.mensagemOpcional?.trim()
      ? `<p style="margin-top:16px;"><strong>Mensagem adicional:</strong><br/>${escapeHtml(opts.mensagemOpcional.trim())}</p>`
      : '';
    const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#1a1a1a;">
<p style="font-weight:600;margin:0 0 12px;">${escapeHtml(opts.titulo)}</p>
${htmlLinhas}
${msgHtml}
<p style="margin-top:20px;font-size:13px;color:#666;">— Mensagem automática Lead2Pack</p>
</div>`;
    return { text, html };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
