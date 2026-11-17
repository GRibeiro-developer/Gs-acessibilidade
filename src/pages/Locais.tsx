import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CodigoTipoLocal,
  LocalAcessivel,
  NovoLocalDTO,
  SituacaoRelato,
} from '../types';
import { PageHeader } from '../components/PageHeader';
import { LocalCard } from '../components/LocalCard';
import { RadarMap } from '../components/RadarMap';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusFeedback';
import { LocalFormModal } from '../components/LocalFormModal';
import { criarLocal, listarLocais } from '../services/locaisService';
import { listarRelatosPorLocal } from '../services/relatosService';
import {
  calcularDistanciaHaversineKm,
  calcularNivelAcessibilidade,
  formatarLabelTipoLocal,
  obterNomeTipoLocal,
} from '../services/acessibilidadeCalc';
import { PONTOS_REFERENCIA_SP, TIPOS_LOCAL_CATALOGO } from '../data/integrantes';
import { ApiException } from '../services/api';
import { IconCheck, IconPin, IconPlus, IconRefresh } from '../components/Icons';

export const Locais: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tipoInicialParam = (searchParams.get('tipo') || 'TODOS').toUpperCase();

  const [locais, setLocais] = useState<LocalAcessivel[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroApi, setErroApi] = useState<{ message: string; status?: number } | null>(
    null
  );

  const [filtroTipo, setFiltroTipo] = useState<CodigoTipoLocal | 'TODOS'>(
    tipoInicialParam === 'CALCADA' ||
      tipoInicialParam === 'RAMPA' ||
      tipoInicialParam === 'ELEVADOR' ||
      tipoInicialParam === 'ESTABELECIMENTO' ||
      tipoInicialParam === 'OBSTACULO'
      ? (tipoInicialParam as CodigoTipoLocal)
      : 'TODOS'
  );
  const [filtroSituacao, setFiltroSituacao] = useState<SituacaoRelato | 'TODAS'>(
    'TODAS'
  );
  const [apenasConfirmados, setApenasConfirmados] = useState<boolean>(false);
  const [buscaTexto, setBuscaTexto] = useState<string>('');

  const [usarFiltroRaio, setUsarFiltroRaio] = useState<boolean>(false);
  const [latRef, setLatRef] = useState<number>(PONTOS_REFERENCIA_SP[0].lat);
  const [lonRef, setLonRef] = useState<number>(PONTOS_REFERENCIA_SP[0].lon);
  const [raioKm, setRaioKm] = useState<number>(5);
  const [statusGps, setStatusGps] = useState<string | null>(null);

  const [modalCriarAberto, setModalCriarAberto] = useState<boolean>(false);
  const [feedbackSucesso, setFeedbackSucesso] = useState<string | null>(null);

  const carregarLocaisDaApi = useCallback(async () => {
    setCarregando(true);
    setErroApi(null);

    try {
      const lista = await listarLocais();
      setLocais(lista);

      const locaisSemRelatos = lista.filter(
        (l) => l.relatos === undefined && l.nivelAcessibilidade === undefined
      );

      if (locaisSemRelatos.length > 0 && locaisSemRelatos.length <= 30) {
        const relatosPorLocal = await Promise.all(
          locaisSemRelatos.map(async (loc) => {
            try {
              const rels = await listarRelatosPorLocal(loc.cdLocal);
              return { cdLocal: loc.cdLocal, relatos: rels };
            } catch {
              return { cdLocal: loc.cdLocal, relatos: [] };
            }
          })
        );
        const mapaRelatos = new Map(
          relatosPorLocal.map((item) => [item.cdLocal, item.relatos])
        );
        setLocais((prev) =>
          prev.map((loc) =>
            mapaRelatos.has(loc.cdLocal)
              ? { ...loc, relatos: mapaRelatos.get(loc.cdLocal) }
              : loc
          )
        );
      }
    } catch (err) {
      if (err instanceof ApiException) {
        setErroApi({ message: err.message, status: err.status });
      } else {
        setErroApi({
          message: 'Erro ao consultar a lista de locais no servidor.',
        });
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarLocaisDaApi();

    const handleApiUrlChange = () => {
      carregarLocaisDaApi();
    };
    window.addEventListener('rotalivre-api-url-changed', handleApiUrlChange);
    return () =>
      window.removeEventListener('rotalivre-api-url-changed', handleApiUrlChange);
  }, [carregarLocaisDaApi]);

  const handleMudarTipo = (novoTipo: CodigoTipoLocal | 'TODOS') => {
    setFiltroTipo(novoTipo);
    if (novoTipo === 'TODOS') {
      searchParams.delete('tipo');
    } else {
      searchParams.set('tipo', novoTipo);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleObterGpsNavegador = () => {
    if (!navigator.geolocation) {
      setStatusGps('Seu navegador não suporta geolocalização.');
      return;
    }
    setStatusGps('Obtendo coordenada do seu dispositivo...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatRef(Number(pos.coords.latitude.toFixed(5)));
        setLonRef(Number(pos.coords.longitude.toFixed(5)));
        setUsarFiltroRaio(true);
        setStatusGps('Localização atual aplicada ao cálculo de distância.');
      },
      () => {
        setStatusGps(
          'Permissão de localização negada. Selecione um ponto de referência na lista.'
        );
      }
    );
  };

  const locaisProcessados = useMemo(() => {
    return locais
      .map((local) => {
        const distanciaKm = calcularDistanciaHaversineKm(
          latRef,
          lonRef,
          local.vlLatitude,
          local.vlLongitude
        );
        const nivel = calcularNivelAcessibilidade(local);
        const codigoTipo = obterNomeTipoLocal(local.cdTipoLocal, local.nmTipoLocal);
        return {
          local,
          distanciaKm,
          nivel,
          codigoTipo,
        };
      })
      .filter(({ local, distanciaKm, nivel, codigoTipo }) => {
        if (filtroTipo !== 'TODOS' && codigoTipo !== filtroTipo) {
          return false;
        }
        if (filtroSituacao !== 'TODAS' && nivel.situacao !== filtroSituacao) {
          return false;
        }
        if (apenasConfirmados && !nivel.confirmado) {
          return false;
        }
        if (usarFiltroRaio && distanciaKm > raioKm) {
          return false;
        }
        if (buscaTexto.trim()) {
          const termo = buscaTexto.toLowerCase();
          const bateNome = local.nmLocal.toLowerCase().includes(termo);
          const bateEnd = local.dsEndereco.toLowerCase().includes(termo);
          if (!bateNome && !bateEnd) return false;
        }
        return true;
      })
      .sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [
    locais,
    latRef,
    lonRef,
    filtroTipo,
    filtroSituacao,
    apenasConfirmados,
    usarFiltroRaio,
    raioKm,
    buscaTexto,
  ]);

  const handleCriarNovoLocal = async (dto: NovoLocalDTO) => {
    await criarLocal(dto);
    setFeedbackSucesso(`Ponto "${dto.nmLocal}" cadastrado com sucesso.`);
    await carregarLocaisDaApi();
  };

  return (
    <div>
      <PageHeader
        badge="Consulta de Acessibilidade"
        title="Mapa e Lista de Pontos Urbanos"
        subtitle="Filtre calçadas, rampas, elevadores, estabelecimentos e obstáculos por categoria, condição nos últimos 30 dias e raio de distância a partir da sua localização."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Mapa e Vias' },
        ]}
        actions={
          <>
            <button
              type="button"
              onClick={() => setModalCriarAberto(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#111315] border-2 border-[#111315] text-xs font-extrabold uppercase tracking-wider transition hc-card"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Cadastrar Ponto</span>
            </button>
            <Link
              to="/relatos/novo"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0052CC] hover:bg-[#003D99] text-white border-2 border-[#111315] text-xs font-extrabold uppercase tracking-wider transition"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Avaliar Local</span>
            </Link>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {feedbackSucesso && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 bg-emerald-50 border-2 border-emerald-700 text-emerald-950 flex items-center justify-between gap-4 hc-card"
          >
            <span className="text-xs sm:text-sm font-bold inline-flex items-center gap-2">
              <IconCheck />
              <span>{feedbackSucesso}</span>
            </span>
            <button
              type="button"
              onClick={() => setFeedbackSucesso(null)}
              className="text-xs font-mono font-bold uppercase underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Painel de Filtros */}
        <section
          aria-label="Filtros de busca de locais e raio geográfico"
          className="bg-white border-2 border-[#111315] p-5 sm:p-6 space-y-5 hc-card"
        >
          <div>
            <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Categoria da Estrutura
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleMudarTipo('TODOS')}
                aria-pressed={filtroTipo === 'TODOS'}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition ${
                  filtroTipo === 'TODOS'
                    ? 'bg-[#111315] text-white border-[#111315]'
                    : 'bg-[#F4F4F0] text-[#111315] border-slate-300 hover:border-[#111315] hc-card'
                }`}
              >
                Todos ({locais.length})
              </button>
              {TIPOS_LOCAL_CATALOGO.map((t) => (
                <button
                  key={t.cdTipoLocal}
                  type="button"
                  onClick={() => handleMudarTipo(t.nmTipoLocal)}
                  aria-pressed={filtroTipo === t.nmTipoLocal}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition ${
                    filtroTipo === t.nmTipoLocal
                      ? 'bg-[#0052CC] text-white border-[#111315]'
                      : 'bg-[#F4F4F0] text-[#111315] border-slate-300 hover:border-[#111315] hc-card'
                  }`}
                >
                  {formatarLabelTipoLocal(t.nmTipoLocal)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label
                htmlFor="filtro-busca-local"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Buscar por rua ou nome
              </label>
              <input
                id="filtro-busca-local"
                type="search"
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
                placeholder="Ex.: Paulista, Estação, Rampa..."
                className="w-full px-3 py-2 border border-slate-400 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="filtro-situacao-local"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Condição de Acessibilidade
              </label>
              <select
                id="filtro-situacao-local"
                value={filtroSituacao}
                onChange={(e) =>
                  setFiltroSituacao(e.target.value as SituacaoRelato | 'TODAS')
                }
                className="w-full px-3 py-2 border border-slate-400 text-sm bg-white"
              >
                <option value="TODAS">Qualquer condição</option>
                <option value="ACESSIVEL">Acessível (nota ≥ 70%)</option>
                <option value="PARCIAL">Parcialmente acessível (40% a 69%)</option>
                <option value="INACESSIVEL">Inacessível (&lt; 40%)</option>
              </select>
            </div>

            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={apenasConfirmados}
                  onChange={(e) => setApenasConfirmados(e.target.checked)}
                  className="w-4 h-4 border-slate-400 accent-[#0052CC]"
                />
                <span className="text-xs sm:text-sm font-bold text-[#111315]">
                  Somente locais confirmados (3+ pessoas)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 bg-slate-50 rounded-xl p-4 border border-slate-300 hc-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-4 flex items-center gap-2.5">
                <input
                  id="toggle-raio-haversine"
                  type="checkbox"
                  checked={usarFiltroRaio}
                  onChange={(e) => setUsarFiltroRaio(e.target.checked)}
                  className="w-5 h-5 border-slate-400 accent-[#0047B3]"
                />
                <label
                  htmlFor="toggle-raio-haversine"
                  className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer"
                >
                  Mostrar apenas locais próximos (até {raioKm} km)
                </label>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label htmlFor="select-ponto-partida" className="sr-only">
                  Escolha sua região de partida
                </label>
                <select
                  id="select-ponto-partida"
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    const ref = PONTOS_REFERENCIA_SP[idx];
                    if (ref) {
                      setLatRef(ref.lat);
                      setLonRef(ref.lon);
                      setStatusGps(`Mostrando distâncias a partir de: ${ref.nome}`);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-400 text-sm bg-white font-semibold text-slate-900"
                >
                  {PONTOS_REFERENCIA_SP.map((p, idx) => (
                    <option key={p.nome} value={idx}>
                      Perto de: {p.nome}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleObterGpsNavegador}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-400 text-sm font-bold shrink-0 hc-card"
                >
                  <IconPin className="w-4 h-4 text-[#0047B3]" />
                  <span>Usar minha localização</span>
                </button>
              </div>

              <div className="lg:col-span-3">
                <label
                  htmlFor="slider-raio-km"
                  className="block text-sm font-bold text-slate-800 mb-1"
                >
                  Distância máxima: <strong>{raioKm} km</strong>
                </label>
                <input
                  id="slider-raio-km"
                  type="range"
                  min={0.5}
                  max={25}
                  step={0.5}
                  value={raioKm}
                  onChange={(e) => {
                    setRaioKm(Number(e.target.value));
                    if (!usarFiltroRaio) setUsarFiltroRaio(true);
                  }}
                  className="w-full accent-[#0047B3]"
                />
              </div>
            </div>

            {statusGps && (
              <p className="mt-2 text-sm font-semibold text-[#0047B3] hc-accent">
                {statusGps}
              </p>
            )}
          </div>
        </section>

        {carregando ? (
          <LoadingState message="Carregando pontos urbanos e avaliações recentes..." />
        ) : erroApi ? (
          <ErrorState
            title="Não foi possível conectar ao servidor de locais"
            message={erroApi.message}
            status={erroApi.status}
            onRetry={carregarLocaisDaApi}
          />
        ) : locaisProcessados.length === 0 ? (
          <EmptyState
            title="Nenhum ponto encontrado para esses critérios"
            description={
              locais.length === 0
                ? 'Ainda não há locais retornados pela API. Você pode cadastrar o primeiro ponto agora.'
                : 'Aumente o raio de distância ou limpe os filtros selecionados para visualizar mais locais.'
            }
            action={
              <div className="flex flex-wrap gap-2">
                {locais.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleMudarTipo('TODOS');
                      setFiltroSituacao('TODAS');
                      setApenasConfirmados(false);
                      setUsarFiltroRaio(false);
                      setBuscaTexto('');
                    }}
                    className="px-4 py-2 bg-[#111315] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Limpar filtros
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalCriarAberto(true)}
                  className="px-4 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Cadastrar Ponto
                </button>
              </div>
            }
          />
        ) : (
          <>
            <RadarMap
              locais={locaisProcessados.map((item) => item.local)}
              latCentro={latRef}
              lonCentro={lonRef}
              raioKm={raioKm}
              usarFiltroRaio={usarFiltroRaio}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <h2 className="font-display text-lg font-bold text-[#111315]">
                {locaisProcessados.length}{' '}
                {locaisProcessados.length === 1 ? 'ponto encontrado' : 'pontos encontrados'}{' '}
                (ordenados por proximidade)
              </h2>
              <button
                type="button"
                onClick={carregarLocaisDaApi}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#111315] text-xs font-bold text-[#111315] hover:bg-slate-100 hc-card"
              >
                <IconRefresh />
                <span>Atualizar dados</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locaisProcessados.map(({ local, distanciaKm }) => (
                <LocalCard
                  key={local.cdLocal}
                  local={local}
                  distanciaKm={distanciaKm}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {modalCriarAberto && (
        <LocalFormModal
          modo="criar"
          onClose={() => setModalCriarAberto(false)}
          onSubmit={handleCriarNovoLocal}
        />
      )}
    </div>
  );
};
