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
  if (texto === 'ACESSIVEL' || texto === 'PARCIAL' || texto === 'INACESSIVEL') {
    return texto;
  }
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
    cdUsuario: toNumber(obj.cdUsuario ?? obj.cd_usuario ?? obj.idUsuario ?? obj.id, 0),
    nmUsuario: toString(obj.nmUsuario ?? obj.nm_usuario ?? obj.nomeUsuario ?? obj.nome, 'Cidadão'),
    dsEmail: toString(obj.dsEmail ?? obj.ds_email ?? obj.email, ''),
    dsPerfilMobilidade: toString(
      obj.dsPerfilMobilidade ?? obj.ds_perfil_mobilidade ?? obj.perfilMobilidade ?? obj.perfil,
      'Cidadão colaborador'
    ),
    dtCadastro: toString(
      obj.dtCadastro ?? obj.dt_cadastro ?? obj.dataCadastro,
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

  return {
    cdRelato: toNumber(obj.cdRelato ?? obj.cd_relato ?? obj.idRelato ?? obj.id, 0),
    cdLocal: toNumber(
      obj.cdLocal ??
        obj.cd_local ??
        obj.idLocal ??
        localAninhado?.cdLocal ??
        localAninhado?.id,
      cdLocalFallback
    ),
    cdUsuario: toNumber(
      obj.cdUsuario ??
        obj.cd_usuario ??
        obj.idUsuario ??
        usuarioAninhado?.cdUsuario ??
        usuarioAninhado?.id,
      0
    ),
    nmUsuario: toString(
      obj.nmUsuario ??
        obj.nm_usuario ??
        obj.nomeUsuario ??
        usuarioAninhado?.nmUsuario ??
        usuarioAninhado?.nome,
      ''
    ),
    dsEmail: toString(
      obj.dsEmail ?? obj.ds_email ?? obj.emailUsuario ?? usuarioAninhado?.dsEmail ?? usuarioAninhado?.email,
      ''
    ),
    dsPerfilMobilidade: toString(
      obj.dsPerfilMobilidade ??
        obj.ds_perfil_mobilidade ??
        usuarioAninhado?.dsPerfilMobilidade ??
        usuarioAninhado?.perfilMobilidade,
      ''
    ),
    dsSituacao: normalizarSituacao(obj.dsSituacao ?? obj.ds_situacao ?? obj.situacao),
    dsObservacao: toString(
      obj.dsObservacao ?? obj.ds_observacao ?? obj.observacao ?? obj.comentario,
      ''
    ),
    dtRelato: toString(
      obj.dtRelato ?? obj.dt_relato ?? obj.dataRelato ?? obj.createdAt,
      new Date().toISOString()
    ),
  };
}

export function normalizarLocalRecurso(raw: unknown, cdLocalFallback = 0): LocalRecurso {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as RawRecord;
  return {
    cdLocal: toNumber(obj.cdLocal ?? obj.cd_local ?? obj.idLocal, cdLocalFallback),
    cdRecurso: toNumber(obj.cdRecurso ?? obj.cd_recurso ?? obj.idRecurso ?? obj.id, 0),
    nmRecurso: toString(obj.nmRecurso ?? obj.nm_recurso ?? obj.nomeRecurso ?? obj.nome, ''),
    dsRecurso: toString(obj.dsRecurso ?? obj.ds_recurso ?? obj.descricao, ''),
    stDisponivel: normalizarStatusAtivo(obj.stDisponivel ?? obj.st_disponivel ?? obj.disponivel),
    dtVerificacao: toString(
      obj.dtVerificacao ?? obj.dt_verificacao ?? obj.dataVerificacao,
      new Date().toISOString()
    ),
  };
}

export function normalizarLocalAcessivel(raw: unknown): LocalAcessivel {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as RawRecord;
  const tipoAninhado =
    obj.tipoLocal && typeof obj.tipoLocal === 'object' ? (obj.tipoLocal as RawRecord) : undefined;

  const cdLocal = toNumber(obj.cdLocal ?? obj.cd_local ?? obj.idLocal ?? obj.id, 0);
  const cdTipoLocal = toNumber(
    obj.cdTipoLocal ??
      obj.cd_tipo_local ??
      obj.idTipoLocal ??
      tipoAninhado?.cdTipoLocal ??
      tipoAninhado?.id,
    1
  );

  const nmTipoLocal = normalizarTipoLocalCodigo(
    obj.nmTipoLocal ?? obj.nm_tipo_local ?? obj.tipo ?? tipoAninhado?.nmTipoLocal ?? tipoAninhado?.nome,
    cdTipoLocal
  );

  const relatosRaw = Array.isArray(obj.relatos) ? obj.relatos : undefined;
  const recursosRaw = Array.isArray(obj.recursos) ? obj.recursos : undefined;

  return {
    cdLocal,
    cdTipoLocal,
    nmTipoLocal,
    nmLocal: toString(obj.nmLocal ?? obj.nm_local ?? obj.nomeLocal ?? obj.nome, 'Local sem nome'),
    dsEndereco: toString(
      obj.dsEndereco ?? obj.ds_endereco ?? obj.endereco,
      'Endereço não informado'
    ),
    vlLatitude: toNumber(obj.vlLatitude ?? obj.vl_latitude ?? obj.latitude ?? obj.lat, -23.5641),
    vlLongitude: toNumber(
      obj.vlLongitude ?? obj.vl_longitude ?? obj.longitude ?? obj.lon ?? obj.lng,
      -46.6524
    ),
    vlInclinacaoPct: toNumber(
      obj.vlInclinacaoPct ?? obj.vl_inclinacao_pct ?? obj.inclinacaoPct ?? obj.inclinacao,
      0
    ),
    vlLarguraCm: toNumber(
      obj.vlLarguraCm ?? obj.vl_largura_cm ?? obj.larguraCm ?? obj.largura,
      120
    ),
    stAtivo: normalizarStatusAtivo(obj.stAtivo ?? obj.st_ativo ?? obj.ativo),
    dtCadastro: toString(
      obj.dtCadastro ?? obj.dt_cadastro ?? obj.dataCadastro,
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
      obj.statusConfirmacao === 'CONFIRMADO' || obj.confirmado === true
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
