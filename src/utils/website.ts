/** Adiciona https:// quando o usuário digita só o domínio. Vazio permanece vazio. */
export function normalizeWebsite(value: string | null | undefined): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
