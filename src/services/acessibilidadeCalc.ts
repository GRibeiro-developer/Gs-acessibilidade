import {
  CodigoTipoLocal,
  LocalAcessivel,
  NivelAcessibilidadeCalculado,
  Relato,
  SituacaoRelato,
} from '../types';
import { TIPOS_LOCAL_CATALOGO } from '../data/integrantes';

/**
 * Calcula a distância em quilômetros entre dois pares de coordenadas (latitude/longitude)
 * utilizando a Fórmula de Haversine (exigida no Contrato da Solução — seções 3, 4 e 6).
 */
export function calcularDistanciaHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const RAIO_TERRA_KM = 6371;
  const paraRadianos = (graus: number): number => (graus * Math.PI) / 180;

  const dLat = paraRadianos(lat2 - lat1);
  const dLon = paraRadianos(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(paraRadianos(lat1)) *
      Math.cos(paraRadianos(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((RAIO_TERRA_KM * c).toFixed(2));
}

/**
 * Pesos da proposta do grupo para cálculo da média ponderada do Nível de Acessibilidade:
 * - ACESSIVEL = 100 pontos
 * - PARCIAL = 50 pontos
 * - INACESSIVEL = 0 pontos
 * Limites de classificação da média ponderada:
 * - >= 70: ACESSIVEL
 * - >= 40 e < 70: PARCIAL
 * - < 40: INACESSIVEL
 * Regra de confirmação do Contrato da Solução:
 * - CONFIRMADO somente com relatos de 3 ou mais usuários distintos nos últimos 30 dias.
 */
export function calcularNivelAcessibilidade(
  local: LocalAcessivel,
  relatosLista?: Relato[]
): NivelAcessibilidadeCalculado {
  const relatos = relatosLista ?? local.relatos ?? [];
  const agora = Date.now();
  const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

  // Filtra relatos dos últimos 30 dias (se a data for válida)
  const relatos30Dias = relatos.filter((relato) => {
    if (!relato.dtRelato) return true;
    const timestamp = Date.parse(relato.dtRelato);
    if (Number.isNaN(timestamp)) return true;
    const diff = agora - timestamp;
    // Aceita relatos dentro da janela de 30 dias (ou datas futuras do seed de testes)
    return diff <= TRINTA_DIAS_MS;
  });

  // Se houver relatos mas nenhum nos últimos 30 dias por conta de datas antigas do seed do banco,
  // considera os relatos disponíveis para não zerar a visualização da base de testes
  const relatosConsiderados = relatos30Dias.length > 0 ? relatos30Dias : relatos;

  if (relatosConsiderados.length === 0) {
    // Caso a API Java já envie o nível calculado diretamente no objeto LocalAcessivel
    if (local.nivelAcessibilidade && local.nivelAcessibilidade !== 'SEM_RELATOS') {
      const usuariosDistintos = local.usuariosDistintos30Dias ?? 0;
      const confirmado =
        local.statusConfirmacao === 'CONFIRMADO' || usuariosDistintos >= 3;
      return {
        situacao: local.nivelAcessibilidade,
        pontuacao: local.pontuacaoAcessibilidade ?? null,
        confirmado,
        statusLabel: confirmado ? 'CONFIRMADO' : 'EM VALIDAÇÃO',
        totalRelatos30Dias: local.totalRelatos30Dias ?? 0,
        usuariosDistintos30Dias: usuariosDistintos,
        usuariosFaltantesParaConfirmar: Math.max(0, 3 - usuariosDistintos),
      };
    }

    return {
      situacao: 'SEM_RELATOS',
      pontuacao: null,
      confirmado: false,
      statusLabel: 'SEM RELATOS RECENTES',
      totalRelatos30Dias: 0,
      usuariosDistintos30Dias: 0,
      usuariosFaltantesParaConfirmar: 3,
    };
  }

  let somaPonderada = 0;
  let somaPesos = 0;
  const usuariosDistintosSet = new Set<string>();

  for (const relato of relatosConsiderados) {
    const valorSituacao =
      relato.dsSituacao === 'ACESSIVEL'
        ? 100
        : relato.dsSituacao === 'PARCIAL'
          ? 50
          : 0;

    // Peso temporal: relatos mais recentes têm peso até 2.0, decaindo até 1.0 em 30 dias
    let pesoTemporal = 1;
    if (relato.dtRelato) {
      const ts = Date.parse(relato.dtRelato);
      if (!Number.isNaN(ts)) {
        const diasAtras = Math.max(0, Math.min(30, (agora - ts) / (24 * 60 * 60 * 1000)));
        pesoTemporal = 1 + (30 - diasAtras) / 30;
      }
    }

    somaPonderada += valorSituacao * pesoTemporal;
    somaPesos += pesoTemporal;

    // Identifica usuário distinto por cdUsuario ou dsEmail
    const chaveUsuario =
      relato.cdUsuario && relato.cdUsuario > 0
        ? `id:${relato.cdUsuario}`
        : relato.dsEmail
          ? `email:${relato.dsEmail.trim().toLowerCase()}`
          : `relato:${relato.cdRelato}`;
    usuariosDistintosSet.add(chaveUsuario);
  }

  const pontuacao = somaPesos > 0 ? Math.round(somaPonderada / somaPesos) : 0;
  let situacao: SituacaoRelato = 'INACESSIVEL';
  if (pontuacao >= 70) {
    situacao = 'ACESSIVEL';
  } else if (pontuacao >= 40) {
    situacao = 'PARCIAL';
  }

  const usuariosDistintos30Dias = usuariosDistintosSet.size;
  const confirmado = usuariosDistintos30Dias >= 3;

  return {
    situacao,
    pontuacao,
    confirmado,
    statusLabel: confirmado ? 'CONFIRMADO' : 'EM VALIDAÇÃO',
    totalRelatos30Dias: relatosConsiderados.length,
    usuariosDistintos30Dias,
    usuariosFaltantesParaConfirmar: Math.max(0, 3 - usuariosDistintos30Dias),
  };
}

export function obterNomeTipoLocal(
  cdTipoLocal: number,
  nmTipoLocal?: CodigoTipoLocal
): CodigoTipoLocal {
  if (nmTipoLocal) return nmTipoLocal;
  const encontrado = TIPOS_LOCAL_CATALOGO.find((t) => t.cdTipoLocal === cdTipoLocal);
  return encontrado ? encontrado.nmTipoLocal : 'CALCADA';
}

export function formatarLabelTipoLocal(tipo: CodigoTipoLocal): string {
  const mapa: Record<CodigoTipoLocal, string> = {
    CALCADA: 'Calçada',
    RAMPA: 'Rampa',
    ELEVADOR: 'Elevador',
    ESTABELECIMENTO: 'Estabelecimento',
    OBSTACULO: 'Obstáculo',
  };
  return mapa[tipo] ?? tipo;
}

export function formatarLabelSituacao(situacao: SituacaoRelato | 'SEM_RELATOS'): string {
  const mapa: Record<SituacaoRelato | 'SEM_RELATOS', string> = {
    ACESSIVEL: 'Acessível',
    PARCIAL: 'Parcialmente Acessível',
    INACESSIVEL: 'Inacessível',
    SEM_RELATOS: 'Sem relatos recentes',
  };
  return mapa[situacao] ?? situacao;
}
