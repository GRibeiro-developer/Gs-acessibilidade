import {
  CodigoTipoLocal,
  LocalAcessivel,
  LocalRecurso,
  Relato,
  SituacaoRelato,
  StatusAtivo,
  Usuario,
} from '../types';
import { obterNomeTipoLocal } from './acessibilidadeCalc';

type RawRecord = Record<string, unknown>;

function toNumber(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    const parsed = Number(val.replace(',', '.'));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function toString(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return fallback;
}

function extrairIdPrimario(obj: RawRecord, chavesPrioritarias: string[]): number {
  for (const chave of chavesPrioritarias) {
    const valor = toNumber(obj[chave], 0);
    if (valor > 0) return valor;
  }
  // Busca fallback por qualquer chave de código/id que não seja FK de tipo
  for (const [k, v] of Object.entries(obj)) {
    const lower = k.toLowerCase();
    if (
      !lower.includes('tipo') &&
      (lower === 'codigo' ||
        lower === 'id' ||
        lower.startsWith('cd') ||
        lower.startsWith('cod') ||
        lower.startsWith('id'))
    ) {
      const num = toNumber(v, 0);
      if (num > 0) return num;
    }
  }
  return 0;
}

function normalizarTipoLocalCodigo(val: unknown, cdTipoLocal: number): CodigoTipoLocal {
  const texto = toString(val).toUpperCase().trim();
  if (
    texto === 'CALCADA' ||
    texto === 'RAMPA' ||
    texto === 'ELEVADOR' ||
    texto === 'ESTABELECIMENTO' ||
    texto === 'OBSTACULO'
  ) {
    return texto;
  }
  return obterNomeTipoLocal(cdTipoLocal);
}

function normalizarSituacao(val: unknown): SituacaoRelato {
  const texto = toString(val).toUpperCase().trim();
  if (texto.includes('INACESSIVEL')) return 'INACESSIVEL';
  if (texto.includes('PARCIAL')) return 'PARCIAL';
  if (texto.includes('ACESSIVEL')) return 'ACESSIVEL';
  return 'PARCIAL';
}

function normalizarStatusAtivo(val: unknown): StatusAtivo {
  if (val === false || val === 'N' || val === 'n' || val === 0 || val === '0') {
    return 'N';
  }
  return 'S';
}

export function normalizarUsuario(raw: unknown): Usuario {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as RawRecord;
  return {
    cdUsuario: extrairIdPrimario(obj, [
      'codigo',
      'codigoUsuario',
      'cdUsuario',
      'cd_usuario',
      'idUsuario',
      'id',
    ]),
    nmUsuario: toString(
      obj.nome ?? obj.nmUsuario ?? obj.nm_usuario ?? obj.nomeUsuario,
      'Cidadão'
    ),
    dsEmail: toString(obj.email ?? obj.dsEmail ?? obj.ds_email, ''),
    dsPerfilMobilidade: toString(
      obj.perfilMobilidade ??
        obj.dsPerfilMobilidade ??
        obj.ds_perfil_mobilidade ??
        obj.perfil,
      'CADEIRANTE'
    ),
    dtCadastro: toString(
      obj.dataCadastro ?? obj.dtCadastro ?? obj.dt_cadastro,
      new Date().toISOString()
    ),
  };
}

export function normalizarRelato(raw: unknown, cdLocalFallback = 0): Relato {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as RawRecord;
  const usuarioAninhado =
    obj.usuario && typeof obj.usuario === 'object' ? (obj.usuario as RawRecord) : undefined;
  const localAninhado =
    obj.local && typeof obj.local === 'object' ? (obj.local as RawRecord) : undefined;

  const cdRelato = extrairIdPrimario(obj, [
    'codigo',
    'codigoRelato',
    'cdRelato',
    'cd_relato',
    'idRelato',
    'id',
  ]);

  const cdLocal =
    toNumber(
      obj.codigoLocal ??
        obj.cdLocal ??
        obj.cd_local ??
        obj.idLocal ??
        localAninhado?.codigo ??
        localAninhado?.cdLocal ??
        localAninhado?.id,
      0
    ) || cdLocalFallback;

  const cdUsuario = toNumber(
    obj.codigoUsuario ??
      obj.cdUsuario ??
      obj.cd_usuario ??
      obj.idUsuario ??
      usuarioAninhado?.codigo ??
      usuarioAninhado?.cdUsuario ??
      usuarioAninhado?.id,
    0
  );

  return {
    cdRelato,
    cdLocal,
    cdUsuario,
    nmUsuario: toString(
      obj.nomeUsuario ??
        obj.nmUsuario ??
        obj.nm_usuario ??
        usuarioAninhado?.nome ??
        usuarioAninhado?.nmUsuario,
      ''
    ),
    dsEmail: toString(
      obj.emailUsuario ??
        obj.email ??
        obj.dsEmail ??
        obj.ds_email ??
        usuarioAninhado?.email ??
        usuarioAninhado?.dsEmail,
      ''
    ),
    dsPerfilMobilidade: toString(
      obj.perfilMobilidade ??
        obj.dsPerfilMobilidade ??
        obj.ds_perfil_mobilidade ??
        usuarioAninhado?.perfilMobilidade ??
        usuarioAninhado?.dsPerfilMobilidade,
      ''
    ),
    dsSituacao: normalizarSituacao(obj.situacao ?? obj.dsSituacao ?? obj.ds_situacao),
    dsObservacao: toString(
      obj.observacao ?? obj.dsObservacao ?? obj.ds_observacao ?? obj.comentario,
      ''
    ),
    dtRelato: toString(
      obj.dataRelato ?? obj.data ?? obj.dtRelato ?? obj.dt_relato ?? obj.createdAt,
      new Date().toISOString()
    ),
  };
}

export function normalizarLocalRecurso(raw: unknown, cdLocalFallback = 0): LocalRecurso {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as RawRecord;
  return {
    cdLocal: toNumber(obj.codigoLocal ?? obj.cdLocal ?? obj.cd_local ?? obj.idLocal, cdLocalFallback),
    cdRecurso: extrairIdPrimario(obj, [
      'codigoRecurso',
      'codigo',
      'cdRecurso',
      'cd_recurso',
      'idRecurso',
      'id',
    ]),
    nmRecurso: toString(obj.nome ?? obj.nmRecurso ?? obj.nm_recurso ?? obj.nomeRecurso, ''),
    dsRecurso: toString(obj.descricao ?? obj.dsRecurso ?? obj.ds_recurso, ''),
    stDisponivel: normalizarStatusAtivo(
      obj.disponivel ?? obj.stDisponivel ?? obj.st_disponivel
    ),
    dtVerificacao: toString(
      obj.dataVerificacao ?? obj.dtVerificacao ?? obj.dt_verificacao,
      new Date().toISOString()
    ),
  };
}

export function normalizarLocalAcessivel(raw: unknown, fallbackIndex = 0): LocalAcessivel {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as RawRecord;
  const tipoAninhado =
    obj.tipoLocal && typeof obj.tipoLocal === 'object' ? (obj.tipoLocal as RawRecord) : undefined;

  const cdLocalExtraido = extrairIdPrimario(obj, [
    'codigo',
    'codigoLocal',
    'cdLocal',
    'cd_local',
    'codLocal',
    'idLocal',
    'id',
  ]);
  const cdLocal = cdLocalExtraido > 0 ? cdLocalExtraido : fallbackIndex;

  const cdTipoLocal = toNumber(
    obj.codigoTipoLocal ??
      obj.cdTipoLocal ??
      obj.cd_tipo_local ??
      obj.idTipoLocal ??
      tipoAninhado?.codigo ??
      tipoAninhado?.cdTipoLocal ??
      tipoAninhado?.id,
    1
  );

  const nmTipoLocal = normalizarTipoLocalCodigo(
    obj.nomeTipoLocal ??
      obj.tipoLocal ??
      obj.nmTipoLocal ??
      obj.nm_tipo_local ??
      obj.tipo ??
      tipoAninhado?.nome ??
      tipoAninhado?.nmTipoLocal,
    cdTipoLocal
  );

  const relatosRaw = Array.isArray(obj.relatos) ? obj.relatos : undefined;
  const recursosRaw = Array.isArray(obj.recursos) ? obj.recursos : undefined;

  return {
    cdLocal,
    cdTipoLocal,
    nmTipoLocal,
    nmLocal: toString(
      obj.nome ?? obj.nomeLocal ?? obj.nmLocal ?? obj.nm_local,
      'Local sem nome'
    ),
    dsEndereco: toString(
      obj.endereco ?? obj.dsEndereco ?? obj.ds_endereco,
      'Endereço não informado'
    ),
    vlLatitude: toNumber(
      obj.latitude ?? obj.vlLatitude ?? obj.vl_latitude ?? obj.lat,
      -23.5641
    ),
    vlLongitude: toNumber(
      obj.longitude ?? obj.vlLongitude ?? obj.vl_longitude ?? obj.lon ?? obj.lng,
      -46.6524
    ),
    vlInclinacaoPct: toNumber(
      obj.inclinacaoPct ?? obj.vlInclinacaoPct ?? obj.vl_inclinacao_pct ?? obj.inclinacao,
      0
    ),
    vlLarguraCm: toNumber(
      obj.larguraCm ?? obj.vlLarguraCm ?? obj.vl_largura_cm ?? obj.largura,
      120
    ),
    stAtivo: normalizarStatusAtivo(obj.ativo ?? obj.statusAtivo ?? obj.stAtivo ?? obj.st_ativo),
    dtCadastro: toString(
      obj.dataCadastro ?? obj.dtCadastro ?? obj.dt_cadastro,
      new Date().toISOString()
    ),
    relatos: relatosRaw ? relatosRaw.map((r) => normalizarRelato(r, cdLocal)) : undefined,
    recursos: recursosRaw
      ? recursosRaw.map((rec) => normalizarLocalRecurso(rec, cdLocal))
      : undefined,
    nivelAcessibilidade: obj.nivelAcessibilidade
      ? normalizarSituacao(obj.nivelAcessibilidade)
      : undefined,
    pontuacaoAcessibilidade:
      obj.pontuacaoAcessibilidade !== undefined
        ? toNumber(obj.pontuacaoAcessibilidade)
        : undefined,
    statusConfirmacao:
      obj.statusConfirmacao === 'CONFIRMADO' ||
      obj.confirmado === true ||
      toString(obj.nivelAcessibilidade).toUpperCase().includes('CONFIRMADO')
        ? 'CONFIRMADO'
        : undefined,
    totalRelatos30Dias:
      obj.totalRelatos30Dias !== undefined ? toNumber(obj.totalRelatos30Dias) : undefined,
    usuariosDistintos30Dias:
      obj.usuariosDistintos30Dias !== undefined
        ? toNumber(obj.usuariosDistintos30Dias)
        : undefined,
  };
}

export function extrairListaDaResposta(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const obj = payload as RawRecord;
    if (Array.isArray(obj.content)) return obj.content;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.locais)) return obj.locais;
    if (Array.isArray(obj.relatos)) return obj.relatos;
    if (Array.isArray(obj.usuarios)) return obj.usuarios;
  }
  return [];
}
