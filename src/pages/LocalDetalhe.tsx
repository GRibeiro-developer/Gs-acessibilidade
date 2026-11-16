import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LocalAcessivel, NovoLocalDTO, Relato } from '../types';
import { PageHeader } from '../components/PageHeader';
import { AccessibilityBadge } from '../components/AccessibilityBadge';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusFeedback';
import { LocalFormModal } from '../components/LocalFormModal';
import {
  atualizarLocal,
  buscarLocalPorId,
  excluirLocal,
} from '../services/locaisService';
import { listarRelatosPorLocal } from '../services/relatosService';
import {
  calcularNivelAcessibilidade,
  formatarLabelSituacao,
  formatarLabelTipoLocal,
  obterNomeTipoLocal,
} from '../services/acessibilidadeCalc';
import { ApiException } from '../services/api';
import {
  IconArrowLeft,
  IconEdit,
  IconExternal,
  IconPlus,
  IconTrash,
} from '../components/Icons';

export const LocalDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cdLocal = Number(id);

  const [local, setLocal] = useState<LocalAcessivel | null>(null);
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroApi, setErroApi] = useState<{ message: string; status?: number } | null>(
    null
  );

  const [modalEditarAberto, setModalEditarAberto] = useState<boolean>(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<boolean>(false);
  const [excluindo, setExcluindo] = useState<boolean>(false);
  const [mensagemFeedback, setMensagemFeedback] = useState<{
    tipo: 'sucesso' | 'erro';
    texto: string;
  } | null>(null);

  const carregarDetalhes = useCallback(async () => {
    if (!id || Number.isNaN(cdLocal) || cdLocal <= 0) {
      setErroApi({
        message: `O código "${id}" não é um identificador válido de local.`,
        status: 400,
      });
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErroApi(null);

    try {
      const [dadosLocal, listaRelatos] = await Promise.all([
        buscarLocalPorId(cdLocal),
        listarRelatosPorLocal(cdLocal).catch(() => [] as Relato[]),
      ]);

      const relatosFinais =
        listaRelatos.length > 0 ? listaRelatos : dadosLocal.relatos ?? [];

      setLocal({ ...dadosLocal, relatos: relatosFinais });
      setRelatos(relatosFinais);
    } catch (err) {
      if (err instanceof ApiException) {
        setErroApi({ message: err.message, status: err.status });
      } else {
        setErroApi({
          message: `Não foi possível carregar os dados do ponto #${cdLocal}.`,
        });
      }
    } finally {
      setCarregando(false);
    }
  }, [id, cdLocal]);

  useEffect(() => {
    carregarDetalhes();
  }, [carregarDetalhes]);

  const handleSalvarEdicao = async (dto: NovoLocalDTO) => {
    const atualizado = await atualizarLocal(cdLocal, dto);
    setLocal({ ...atualizado, relatos });
    setMensagemFeedback({
      tipo: 'sucesso',
      texto: `Dados do ponto #${cdLocal} atualizados com sucesso.`,
    });
  };

  const handleExcluirLocal = async () => {
    setExcluindo(true);
    setMensagemFeedback(null);
    try {
      await excluirLocal(cdLocal);
      navigate('/locais', { replace: true });
    } catch (err) {
      setConfirmandoExclusao(false);
      if (err instanceof ApiException) {
        setMensagemFeedback({
          tipo: 'erro',
          texto:
            err.status === 409
              ? 'Este local já possui avaliações registradas por cidadãos e não pode ser removido (HTTP 409). Para desativá-lo sem apagar o histórico, clique em "Editar" e altere a situação para Inativo.'
              : `${err.message} (HTTP ${err.status})`,
        });
      } else {
        setMensagemFeedback({
          tipo: 'erro',
          texto: 'Não foi possível excluir o local.',
        });
      }
    } finally {
      setExcluindo(false);
    }
  };

  if (carregando) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState message={`Carregando ficha técnica e avaliações do ponto #${id}...`} />
      </div>
    );
  }

  if (erroApi || !local) {
    return (
      <div>
        <PageHeader
          badge={`Ponto Urbano #${id}`}
          title="Local não encontrado ou indisponível"
          subtitle="Não foi possível carregar as informações deste ponto no servidor."
          breadcrumbs={[
            { label: 'Início', to: '/' },
            { label: 'Mapa e Vias', to: '/locais' },
            { label: `Ponto #${id}` },
          ]}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
          <ErrorState
            title={`Falha ao carregar o ponto #${id}`}
            message={erroApi?.message ?? 'Registro não localizado.'}
            status={erroApi?.status}
            onRetry={carregarDetalhes}
          />
          <div>
            <Link
              to="/locais"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#111315] text-white text-xs font-bold uppercase tracking-wider"
            >
              <IconArrowLeft />
              <span>Voltar para o Mapa</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const codigoTipo = obterNomeTipoLocal(local.cdTipoLocal, local.nmTipoLocal);
  const nivel = calcularNivelAcessibilidade(local, relatos);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${local.vlLatitude},${local.vlLongitude}`;

  return (
    <div>
      <PageHeader
        badge={`Ponto #${local.cdLocal} · ${formatarLabelTipoLocal(codigoTipo)}`}
        title={local.nmLocal}
        subtitle={local.dsEndereco}
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Mapa e Vias', to: '/locais' },
          { label: local.nmLocal },
        ]}
        actions={
          <>
            <Link
              to={`/relatos/novo?localId=${local.cdLocal}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F5B700] hover:bg-amber-400 text-[#111315] border-2 border-[#111315] text-xs font-extrabold uppercase tracking-wider transition"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Avaliar este Local</span>
            </Link>
            <button
              type="button"
              onClick={() => setModalEditarAberto(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-[#111315] border-2 border-[#111315] text-xs font-bold uppercase transition hc-card"
            >
              <IconEdit />
              <span>Editar</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoExclusao(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-red-50 text-red-700 border-2 border-red-700 text-xs font-bold uppercase transition hc-card"
            >
              <IconTrash />
              <span>Excluir</span>
            </button>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {mensagemFeedback && (
          <div
            role="alert"
            className={`p-4 border-2 flex items-start justify-between gap-4 hc-card ${
              mensagemFeedback.tipo === 'sucesso'
                ? 'bg-emerald-50 border-emerald-700 text-emerald-950'
                : 'bg-red-50 border-red-700 text-red-950'
            }`}
          >
            <p className="text-xs sm:text-sm font-bold leading-relaxed">
              {mensagemFeedback.texto}
            </p>
            <button
              type="button"
              onClick={() => setMensagemFeedback(null)}
              className="text-xs font-mono font-bold uppercase underline shrink-0"
            >
              Fechar
            </button>
          </div>
        )}

        {confirmandoExclusao && (
          <div
            role="alertdialog"
            aria-labelledby="titulo-confirmar-exclusao"
            className="bg-red-50 border-2 border-red-700 p-5 sm:p-6 hc-card"
          >
            <h2
              id="titulo-confirmar-exclusao"
              className="font-display text-base font-bold text-red-950"
            >
              Confirmar exclusão do ponto #{local.cdLocal} ({local.nmLocal})?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-red-900">
              Caso este local já possua relatos de cidadãos, a exclusão será recusada pelo servidor
              para preservar o histórico de avaliações.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={excluindo}
                onClick={handleExcluirLocal}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase"
              >
                {excluindo ? 'Removendo...' : 'Confirmar exclusão'}
              </button>
              <button
                type="button"
                disabled={excluindo}
                onClick={() => setConfirmandoExclusao(false)}
                className="px-4 py-2 bg-white border border-[#111315] text-[#111315] text-xs font-bold uppercase"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 bg-white border-2 border-[#111315] p-6 space-y-5 hc-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#111315]">
                Índice de Acessibilidade (Últimos 30 dias)
              </h2>
              <span
                className={`px-2.5 py-0.5 font-mono text-xs font-bold uppercase border ${
                  local.stAtivo === 'S'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-700'
                    : 'bg-slate-200 text-slate-700 border-slate-400'
                }`}
              >
                {local.stAtivo === 'S' ? 'Cadastro Ativo' : 'Cadastro Inativo'}
              </span>
            </div>

            <AccessibilityBadge nivel={nivel} />

            <div className="bg-[#F4F4F0] border border-slate-300 p-4 hc-card">
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-1.5">
                <span>Média ponderada recente</span>
                <span>
                  {nivel.pontuacao !== null ? `${nivel.pontuacao} / 100` : 'Sem avaliações'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 border border-[#111315] overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    nivel.situacao === 'ACESSIVEL'
                      ? 'bg-emerald-600'
                      : nivel.situacao === 'PARCIAL'
                        ? 'bg-[#F5B700]'
                        : nivel.situacao === 'INACESSIVEL'
                          ? 'bg-red-600'
                          : 'bg-slate-400'
                  }`}
                  style={{ width: `${nivel.pontuacao ?? 0}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-white border border-slate-300 hc-card">
                  <span className="text-slate-500 block text-[11px]">Status</span>
                  <strong className="font-mono text-[#111315]">
                    {nivel.confirmado ? 'CONFIRMADO' : 'EM VALIDAÇÃO'}
                  </strong>
                </div>
                <div className="p-2.5 bg-white border border-slate-300 hc-card">
                  <span className="text-slate-500 block text-[11px]">Avaliadores (30d)</span>
                  <strong className="font-mono text-[#111315]">
                    {nivel.usuariosDistintos30Dias} de 3 pessoas
                  </strong>
                </div>
                <div className="p-2.5 bg-white border border-slate-300 hc-card">
                  <span className="text-slate-500 block text-[11px]">Total no Histórico</span>
                  <strong className="font-mono text-[#111315]">{relatos.length} relatos</strong>
                </div>
              </div>

              {!nivel.confirmado && (
                <p className="mt-3 text-xs text-[#0052CC] font-semibold hc-accent">
                  Faltam {nivel.usuariosFaltantesParaConfirmar}{' '}
                  {nivel.usuariosFaltantesParaConfirmar === 1
                    ? 'avaliação de pessoa diferente'
                    : 'avaliações de pessoas diferentes'}{' '}
                  para que este local receba o selo de confirmação.
                </p>
              )}
            </div>

            {local.recursos && local.recursos.length > 0 && (
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Recursos de Acessibilidade Verificados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {local.recursos.map((rec) => (
                    <span
                      key={`${rec.cdLocal}-${rec.cdRecurso}`}
                      className={`px-3 py-1 text-xs font-bold border ${
                        rec.stDisponivel === 'S'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-700'
                          : 'bg-red-50 text-red-900 border-red-700'
                      } hc-card`}
                    >
                      {rec.nmRecurso || `Recurso #${rec.cdRecurso}`} (
                      {rec.stDisponivel === 'S' ? 'Disponível' : 'Indisponível'})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="lg:col-span-5 bg-white border-2 border-[#111315] p-6 flex flex-col justify-between hc-card">
            <div>
              <h2 className="font-display text-lg font-bold text-[#111315] mb-4">
                Medidas Físicas e Localização
              </h2>

              <dl className="space-y-3 text-sm">
                <div className="p-3.5 bg-[#F4F4F0] border border-slate-300 flex items-center justify-between hc-card">
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold">
                      Inclinação da Rampa / Via
                    </dt>
                    <dd className="font-mono text-base font-bold text-[#111315] mt-0.5">
                      {local.vlInclinacaoPct}%
                    </dd>
                  </div>
                  <span
                    className={`px-2.5 py-1 font-mono text-xs font-bold border ${
                      local.vlInclinacaoPct <= 8.33
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-700'
                        : 'bg-amber-100 text-amber-950 border-amber-700'
                    }`}
                  >
                    {local.vlInclinacaoPct <= 8.33
                      ? 'Dentro da NBR 9050 (≤ 8,33%)'
                      : 'Acima de 8,33%'}
                  </span>
                </div>

                <div className="p-3.5 bg-[#F4F4F0] border border-slate-300 flex items-center justify-between hc-card">
                  <div>
                    <dt className="text-xs text-slate-500 font-semibold">
                      Largura Livre de Passagem
                    </dt>
                    <dd className="font-mono text-base font-bold text-[#111315] mt-0.5">
                      {local.vlLarguraCm} cm
                    </dd>
                  </div>
                  <span
                    className={`px-2.5 py-1 font-mono text-xs font-bold border ${
                      local.vlLarguraCm >= 120
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-700'
                        : local.vlLarguraCm >= 90
                          ? 'bg-amber-100 text-amber-950 border-amber-700'
                          : 'bg-red-100 text-red-950 border-red-700'
                    }`}
                  >
                    {local.vlLarguraCm >= 120
                      ? 'Faixa Livre Ideal (≥ 120 cm)'
                      : local.vlLarguraCm >= 90
                        ? 'Estreita (90–119 cm)'
                        : 'Inferior a 90 cm'}
                  </span>
                </div>

                <div className="p-3.5 bg-[#F4F4F0] border border-slate-300 hc-card">
                  <dt className="text-xs text-slate-500 font-semibold">Coordenadas Geográficas</dt>
                  <dd className="font-mono text-xs sm:text-sm font-bold text-[#111315] mt-1">
                    {local.vlLatitude}, {local.vlLongitude}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#111315] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                <span>Ver no Google Maps</span>
                <IconExternal />
              </a>
              <Link
                to="/locais"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#111315] text-xs font-bold uppercase border border-[#111315] transition hc-card"
              >
                <IconArrowLeft />
                <span>Mapa</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Lista de Relatos */}
        <section aria-labelledby="titulo-relatos-local" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2
                id="titulo-relatos-local"
                className="font-display text-xl font-bold text-[#111315]"
              >
                Relatos da Comunidade ({relatos.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Avaliações enviadas por cidadãos que passaram por este ponto.
              </p>
            </div>

            <Link
              to={`/relatos/novo?localId=${local.cdLocal}`}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider transition"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Enviar Meu Relato</span>
            </Link>
          </div>

          {relatos.length === 0 ? (
            <EmptyState
              title="Nenhuma avaliação registrada para este ponto"
              description="Se você conhece este local, envie o primeiro relato para ajudar outras pessoas a planejarem seu trajeto."
              action={
                <Link
                  to={`/relatos/novo?localId=${local.cdLocal}`}
                  className="px-4 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Registrar Primeiro Relato
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatos.map((relato) => {
                const badgeClass =
                  relato.dsSituacao === 'ACESSIVEL'
                    ? 'bg-emerald-700 text-white'
                    : relato.dsSituacao === 'PARCIAL'
                      ? 'bg-[#F5B700] text-[#111315]'
                      : 'bg-red-700 text-white';

                const dataFormatada = (() => {
                  const ts = Date.parse(relato.dtRelato);
                  if (Number.isNaN(ts)) return relato.dtRelato;
                  return new Date(ts).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                })();

                return (
                  <article
                    key={relato.cdRelato || `${relato.cdUsuario}-${relato.dtRelato}`}
                    className="bg-white border-2 border-[#111315] p-5 hc-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span
                        className={`px-2.5 py-0.5 font-mono text-xs font-bold uppercase ${badgeClass}`}
                      >
                        {formatarLabelSituacao(relato.dsSituacao)}
                      </span>
                      <span className="font-mono text-xs text-slate-500">{dataFormatada}</span>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed">
                      {relato.dsObservacao || 'Avaliação registrada sem observação adicional.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span>
                        <strong>Por:</strong>{' '}
                        {relato.nmUsuario ||
                          relato.dsEmail ||
                          `Cidadão #${relato.cdUsuario}`}
                      </span>
                      {relato.dsPerfilMobilidade && (
                        <span className="px-2 py-0.5 bg-[#F4F4F0] text-[#111315] font-mono text-[11px] font-semibold border border-slate-300">
                          {relato.dsPerfilMobilidade}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {modalEditarAberto && (
        <LocalFormModal
          modo="editar"
          localInicial={local}
          onClose={() => setModalEditarAberto(false)}
          onSubmit={handleSalvarEdicao}
        />
      )}
    </div>
  );
};
