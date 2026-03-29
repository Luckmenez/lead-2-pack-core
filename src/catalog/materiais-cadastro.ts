/**
 * Deve refletir `MATERIAIS_FILTRO_OPCOES` do front (cadastro fornecedor/profissional).
 * Atualizar os dois ao incluir novos materiais.
 */
export const MATERIAIS_PADRAO_CADASTRO = [
  'Papel / Papelão',
  'Plásticos',
  'Vidro',
  'Metal e Alumínio',
  'Madeira / Bambu',
  'Tecido / Têxtil',
  'Biopolímeros / Compostáveis',
  'Multicamadas / Laminados',
  'Rótulos e Etiquetas',
  'Outros (Cerâmica, EPS)',
] as const;

const PROF_REGISTRATION_EXTRA = [
  'Plástico flexíveis',
  'Plásticos semi-rígidos',
  'Plásticos rígidos',
  'Metal',
  'Alumínio',
  'Madeira',
  'Papel cartão',
  'Papelão ondulado',
  'Rótulos e etiquetas',
  'Fitas, alças, papel presente',
  'Acabamentos especiais',
  'Blister',
  'Sustentabilidade',
  'Mercados específicos',
  'Especialidades',
  'Editorial',
  'Não personalizados',
  'Descartáveis',
  'Agências e consultorias',
  'Associações e entidades',
  'Profissionais autônomos',
  'Logística e transporte',
  'Co-packers e terceiros',
  'Gráficas rápidas',
  'Equipamentos e Sistemas',
  'Máquinas e equipamentos',
  'Tecnologia e sistemas',
  'Matérias-primas e insumos',
  'Insumos indiretos',
];

export const MATERIAIS_FILTRO_OPCOES: string[] = Array.from(
  new Set<string>([...MATERIAIS_PADRAO_CADASTRO, ...PROF_REGISTRATION_EXTRA]),
).sort((a, b) => a.localeCompare(b, 'pt-BR'));
