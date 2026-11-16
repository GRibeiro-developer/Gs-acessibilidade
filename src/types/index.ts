/**
 * Vocabulário oficial e tipagem da solução Rotalivre (GS 2026/2 CitizenTech)
 * Espelha estritamente as 6 tabelas do Banco Oracle e os DTOs da API Java:
 * - tb_usuario
 * - tb_tipo_local
 * - tb_local_acessivel
 * - tb_relato
 * - tb_recurso_acessibilidade
 * - tb_local_recurso
 */

export type CodigoTipoLocal =
  | 'CALCADA'
  | 'RAMPA'
  | 'ELEVADOR'
  | 'ESTABELECIMENTO'
  | 'OBSTACULO';

export type SituacaoRelato = 'ACESSIVEL' | 'PARCIAL' | 'INACESSIVEL';

export type StatusAtivo = 'S' | 'N';

export interface TipoLocal {
  cdTipoLocal: number;
  nmTipoLocal: CodigoTipoLocal;
  dsTipoLocal: string;
}

export interface RecursoAcessibilidade {
  cdRecurso: number;
  nmRecurso: string;
  dsRecurso: string;
}

export interface LocalRecurso {
  cdLocal: number;
  cdRecurso: number;
  nmRecurso?: string;
  dsRecurso?: string;
  stDisponivel: StatusAtivo;
  dtVerificacao: string;
}

export interface Usuario {
  cdUsuario: number;
  nmUsuario: string;
  dsEmail: string;
  dsPerfilMobilidade: string;
  dtCadastro: string;
}

export interface NovoUsuarioDTO {
  nmUsuario: string;
  dsEmail: string;
  dsPerfilMobilidade: string;
}

export interface Relato {
  cdRelato: number;
  cdLocal: number;
  cdUsuario: number;
  nmUsuario?: string;
  dsEmail?: string;
  dsPerfilMobilidade?: string;
  dsSituacao: SituacaoRelato;
  dsObservacao: string;
  dtRelato: string;
}

export interface NovoRelatoDTO {
  cdLocal: number;
  cdUsuario?: number;
  dsEmail: string;
  nmUsuario?: string;
  dsPerfilMobilidade?: string;
  dsSituacao: SituacaoRelato;
  dsObservacao: string;
}

export interface LocalAcessivel {
  cdLocal: number;
  cdTipoLocal: number;
  nmTipoLocal?: CodigoTipoLocal;
  nmLocal: string;
  dsEndereco: string;
  vlLatitude: number;
  vlLongitude: number;
  vlInclinacaoPct: number; // CHECK (0 a 100)
  vlLarguraCm: number; // CHECK (> 0)
  stAtivo: StatusAtivo; // CHECK ('S'/'N')
  dtCadastro: string;
  recursos?: LocalRecurso[];
  relatos?: Relato[];
  // Campos opcionais caso a API Java já envie o nível calculado no DTO de saída
  nivelAcessibilidade?: SituacaoRelato | 'SEM_RELATOS';
  pontuacaoAcessibilidade?: number;
  statusConfirmacao?: 'CONFIRMADO' | 'EM_VALIDACAO' | 'SEM_RELATOS';
  totalRelatos30Dias?: number;
  usuariosDistintos30Dias?: number;
}

export interface NovoLocalDTO {
  cdTipoLocal: number;
  nmLocal: string;
  dsEndereco: string;
  vlLatitude: number;
  vlLongitude: number;
  vlInclinacaoPct: number;
  vlLarguraCm: number;
  stAtivo: StatusAtivo;
}

export interface NivelAcessibilidadeCalculado {
  situacao: SituacaoRelato | 'SEM_RELATOS';
  pontuacao: number | null; // 0 a 100
  confirmado: boolean; // true somente se >= 3 usuários distintos nos últimos 30 dias
  statusLabel: 'CONFIRMADO' | 'EM VALIDAÇÃO' | 'SEM RELATOS RECENTES';
  totalRelatos30Dias: number;
  usuariosDistintos30Dias: number;
  usuariosFaltantesParaConfirmar: number;
}

export interface FiltroLocaisParams {
  tipo?: CodigoTipoLocal | 'TODOS';
  situacao?: SituacaoRelato | 'TODAS';
  apenasConfirmados?: boolean;
  busca?: string;
  usarFiltroRaio?: boolean;
  latReferencia?: number;
  lonReferencia?: number;
  raioKm?: number;
}

export interface ApiErrorResponse {
  status: number;
  error?: string;
  message: string;
  timestamp?: string;
  path?: string;
  fields?: Record<string, string>;
}

export interface Integrante {
  rm: string;
  nome: string;
  turma: string;
  papel: string;
  frentePrincipal: string;
  frentesApoio: string[];
  bio: string;
  habilidades: string[];
  github: string;
  linkedin: string;
  fotoUrl: string;
}
