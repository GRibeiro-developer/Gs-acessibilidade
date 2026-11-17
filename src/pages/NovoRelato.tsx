import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LocalAcessivel, SituacaoRelato } from '../types';
import { PageHeader } from '../components/PageHeader';
import { listarLocais } from '../services/locaisService';
import { criarRelatoNoLocal } from '../services/relatosService';
import { formatarLabelTipoLocal, obterNomeTipoLocal } from '../services/acessibilidadeCalc';
import { ApiException } from '../services/api';
import { IconAlert, IconBlock, IconCheck } from '../components/Icons';

interface ErrosFormRelato {
  cdLocal?: string;
  dsEmail?: string;
  nmUsuario?: string;
  dsSituacao?: string;
  dsObservacao?: string;
}

export const NovoRelato: React.FC = () => {
  const [searchParams] = useSearchParams();
  const localIdParam = Number(searchParams.get('localId') || 0);

  const [locaisDisponiveis, setLocaisDisponiveis] = useState<LocalAcessivel[]>([]);
  const [carregandoLocais, setCarregandoLocais] = useState<boolean>(true);

  const [cdLocalSelecionado, setCdLocalSelecionado] = useState<number>(
    localIdParam > 0 ? localIdParam : 0
  );
  const [dsEmail, setDsEmail] = useState<string>('');
  const [nmUsuario, setNmUsuario] = useState<string>('');
  const [dsPerfilMobilidade, setDsPerfilMobilidade] = useState<string>(
    'CADEIRANTE'
  );
  const [dsSituacao, setDsSituacao] = useState<SituacaoRelato>('ACESSIVEL');
  const [dsObservacao, setDsObservacao] = useState<string>('');

  const [erros, setErros] = useState<ErrosFormRelato>({});
  const [enviando, setEnviando] = useState<boolean>(false);
  const [erroApi, setErroApi] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [sucessoRelato, setSucessoRelato] = useState<{
    cdLocal: number;
    dsSituacao: SituacaoRelato;
    dsEmail: string;
  } | null>(null);

  useEffect(() => {
    let ativo = true;
    setCarregandoLocais(true);
    listarLocais()
      .then((lista) => {
        if (!ativo) return;
        setLocaisDisponiveis(lista);
        if (localIdParam > 0) {
          setCdLocalSelecionado(localIdParam);
        } else if (lista.length > 0) {
          setCdLocalSelecionado(lista[0].cdLocal);
        }
      })
      .catch(() => {
        // Permite digitar o código numérico do local se a listagem não carregar
      })
      .finally(() => {
        if (ativo) setCarregandoLocais(false);
      });

    return () => {
      ativo = false;
    };
  }, [localIdParam]);

  const validarFormulario = (): boolean => {
    const novosErros: ErrosFormRelato = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cdLocalSelecionado || cdLocalSelecionado <= 0) {
      novosErros.cdLocal = 'Selecione o local urbano que você está avaliando.';
    }

    if (!dsEmail.trim() || !emailRegex.test(dsEmail.trim())) {
      novosErros.dsEmail =
        'Informe um e-mail válido para identificar sua avaliação (ex.: nome@email.com).';
    }

    if (!nmUsuario.trim() || nmUsuario.trim().length < 2) {
      novosErros.nmUsuario = 'Informe seu nome ou como prefere ser identificado.';
    }

    if (
      dsSituacao !== 'ACESSIVEL' &&
      dsSituacao !== 'PARCIAL' &&
      dsSituacao !== 'INACESSIVEL'
    ) {
      novosErros.dsSituacao = 'Selecione uma das três condições de acessibilidade.';
    }

    if (!dsObservacao.trim() || dsObservacao.trim().length < 10) {
      novosErros.dsObservacao =
        'Descreva brevemente o que você encontrou no local (mínimo de 10 caracteres).';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroApi(null);
    setSucessoRelato(null);

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);
    try {
      await criarRelatoNoLocal(cdLocalSelecionado, {
        cdLocal: cdLocalSelecionado,
        dsEmail: dsEmail.trim().toLowerCase(),
        nmUsuario: nmUsuario.trim(),
        dsPerfilMobilidade,
        dsSituacao,
        dsObservacao: dsObservacao.trim(),
      });

      setSucessoRelato({
        cdLocal: cdLocalSelecionado,
        dsSituacao,
        dsEmail: dsEmail.trim().toLowerCase(),
      });
      setDsObservacao('');
      setErros({});
    } catch (err) {
      if (err instanceof ApiException) {
        setErroApi({
          status: err.status,
          message: err.message,
        });
        if (err.fields) {
          setErros((prev) => ({ ...prev, ...err.fields }));
        }
      } else {
        setErroApi({
          status: 0,
          message: 'Não foi possível enviar o relato para o servidor.',
        });
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Relato Colaborativo"
        title="Avaliar Condição de um Local"
        subtitle="Informe como está a passagem em uma calçada, rampa, elevador ou estabelecimento. Não é necessário criar senha: sua avaliação é identificada pelo seu e-mail."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Mapa e Vias', to: '/locais' },
          { label: 'Avaliar Local' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {sucessoRelato && (
          <div
            role="status"
            aria-live="polite"
            className="bg-emerald-50 border-2 border-emerald-700 p-6 text-emerald-950 hc-card"
          >
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2">
              <IconCheck />
              <span>Avaliação registrada com sucesso.</span>
            </h2>
            <p className="mt-1 text-sm leading-relaxed">
              Seu relato (<strong>{sucessoRelato.dsSituacao}</strong>) para o ponto{' '}
              <strong>#{sucessoRelato.cdLocal}</strong> foi vinculado ao e-mail{' '}
              <code className="font-mono">{sucessoRelato.dsEmail}</code> e já integra o cálculo dos
              últimos 30 dias.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/locais/${sucessoRelato.cdLocal}`}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                Ver Ficha do Ponto #{sucessoRelato.cdLocal}
              </Link>
              <Link
                to="/locais"
                className="px-4 py-2 bg-white border border-emerald-800 text-emerald-950 text-xs font-bold uppercase hover:bg-emerald-100 transition hc-card"
              >
                Voltar para o Mapa
              </Link>
            </div>
          </div>
        )}

        {erroApi && (
          <div
            role="alert"
            className="bg-red-50 border-2 border-red-700 p-6 text-red-950 hc-card"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold">
                {erroApi.status === 409
                  ? 'Limite diário atingido para este local (HTTP 409)'
                  : 'Não foi possível enviar sua avaliação'}
              </h2>
              {erroApi.status > 0 && (
                <span className="px-2 py-0.5 bg-red-200 text-red-900 font-mono text-xs font-bold">
                  HTTP {erroApi.status}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed">{erroApi.message}</p>
            {erroApi.status === 409 && (
              <p className="mt-2 text-xs text-red-800 font-semibold">
                Para garantir que a nota reflita a visão de pessoas diferentes, cada e-mail pode
                registrar apenas 1 relato por local no mesmo dia.
              </p>
            )}
          </div>
        )}

        <section
          aria-labelledby="titulo-form-relato"
          className="bg-white border-2 border-[#111315] p-6 sm:p-8 hc-card"
        >
          <div className="pb-4 border-b-2 border-[#111315]">
            <h2 id="titulo-form-relato" className="font-display text-xl font-bold text-[#111315]">
              Formulário de Avaliação
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Quando 3 ou mais pessoas diferentes avaliam o mesmo ponto em um intervalo de 30 dias,
              a condição do local recebe o selo de confirmação.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
            <div>
              <label
                htmlFor="relato-local"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                1. Local Avaliado *
              </label>
              {carregandoLocais ? (
                <div className="p-3 bg-[#F4F4F0] border border-slate-300 text-xs text-slate-600 font-mono">
                  Consultando locais cadastrados...
                </div>
              ) : locaisDisponiveis.length > 0 ? (
                <select
                  id="relato-local"
                  required
                  value={cdLocalSelecionado}
                  onChange={(e) => {
                    setCdLocalSelecionado(Number(e.target.value));
                    if (erros.cdLocal) setErros({ ...erros, cdLocal: undefined });
                  }}
                  aria-invalid={Boolean(erros.cdLocal)}
                  className={`w-full px-3.5 py-2.5 border text-sm bg-white ${
                    erros.cdLocal ? 'border-red-600' : 'border-slate-400'
                  }`}
                >
                  <option value={0}>Selecione o ponto na lista...</option>
                  {locaisDisponiveis.map((loc) => {
                    const tipo = obterNomeTipoLocal(loc.cdTipoLocal, loc.nmTipoLocal);
                    return (
                      <option key={loc.cdLocal} value={loc.cdLocal}>
                        #{loc.cdLocal} [{formatarLabelTipoLocal(tipo)}] — {loc.nmLocal} (
                        {loc.dsEndereco})
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div>
                  <input
                    id="relato-local"
                    type="number"
                    min={1}
                    required
                    value={cdLocalSelecionado || ''}
                    onChange={(e) => setCdLocalSelecionado(Number(e.target.value))}
                    placeholder="Código numérico do ponto (ex.: 1)"
                    className="w-full px-3.5 py-2.5 border border-slate-400 text-sm font-mono"
                  />
                  <span className="block text-[11px] text-slate-500 mt-1">
                    Se o local ainda não estiver cadastrado, adicione-o na página{' '}
                    <Link to="/locais" className="underline font-bold text-[#0052CC]">
                      Mapa e Vias
                    </Link>
                    .
                  </span>
                </div>
              )}
              {erros.cdLocal && (
                <p role="alert" className="mt-1 text-xs font-bold text-red-700">
                  {erros.cdLocal}
                </p>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-[#F4F4F0] border border-slate-300 space-y-4 hc-card">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111315] uppercase tracking-wide">
                  2. Sua Identificação (Sem Senha)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Usamos seu e-mail apenas para contabilizar avaliadores distintos e evitar relatos
                  duplicados no mesmo dia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="relato-email"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Seu E-mail *
                  </label>
                  <input
                    id="relato-email"
                    type="email"
                    required
                    value={dsEmail}
                    onChange={(e) => {
                      setDsEmail(e.target.value);
                      if (erros.dsEmail) setErros({ ...erros, dsEmail: undefined });
                    }}
                    aria-invalid={Boolean(erros.dsEmail)}
                    placeholder="voce@email.com"
                    className={`w-full px-3 py-2 border text-sm bg-white ${
                      erros.dsEmail ? 'border-red-600' : 'border-slate-400'
                    }`}
                  />
                  {erros.dsEmail && (
                    <p role="alert" className="mt-1 text-xs font-bold text-red-700">
                      {erros.dsEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="relato-nome"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Seu Nome *
                  </label>
                  <input
                    id="relato-nome"
                    type="text"
                    required
                    value={nmUsuario}
                    onChange={(e) => {
                      setNmUsuario(e.target.value);
                      if (erros.nmUsuario) setErros({ ...erros, nmUsuario: undefined });
                    }}
                    aria-invalid={Boolean(erros.nmUsuario)}
                    placeholder="Ex.: Ana Silva"
                    className={`w-full px-3 py-2 border text-sm bg-white ${
                      erros.nmUsuario ? 'border-red-600' : 'border-slate-400'
                    }`}
                  />
                  {erros.nmUsuario && (
                    <p role="alert" className="mt-1 text-xs font-bold text-red-700">
                      {erros.nmUsuario}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="relato-perfil"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Perfil de Mobilidade
                  </label>
                  <select
                    id="relato-perfil"
                    value={dsPerfilMobilidade}
                    onChange={(e) => setDsPerfilMobilidade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-400 text-sm bg-white"
                  >
                    <option value="CADEIRANTE">Cadeirante</option>
                    <option value="IDOSO">Idoso</option>
                    <option value="BAIXA_VISAO">Baixa visão / Pessoa cega</option>
                    <option value="MOBILIDADE_REDUZIDA">Mobilidade reduzida</option>
                    <option value="CARRINHO_BEBE">Pai / Mãe com carrinho de bebê</option>
                  </select>
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Condição Encontrada no Local *
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      valor: 'ACESSIVEL' as SituacaoRelato,
                      titulo: 'Acessível',
                      desc: 'Passagem livre, rampa adequada e equipamentos funcionando.',
                      corAtiva: 'border-emerald-700 bg-emerald-50 text-emerald-950',
                      icone: <IconCheck />,
                    },
                    {
                      valor: 'PARCIAL' as SituacaoRelato,
                      titulo: 'Parcial',
                      desc: 'É possível passar, mas há desgaste, inclinação alta ou exige ajuda.',
                      corAtiva: 'border-[#111315] bg-[#F5B700]/25 text-[#111315]',
                      icone: <IconAlert />,
                    },
                    {
                      valor: 'INACESSIVEL' as SituacaoRelato,
                      titulo: 'Inacessível',
                      desc: 'Bloqueado por degrau sem rampa, buraco, obra ou elevador parado.',
                      corAtiva: 'border-red-700 bg-red-50 text-red-950',
                      icone: <IconBlock />,
                    },
                  ] as const
                ).map((opcao) => {
                  const selecionado = dsSituacao === opcao.valor;
                  return (
                    <label
                      key={opcao.valor}
                      className={`cursor-pointer border-2 p-4 transition flex flex-col justify-between hc-card ${
                        selecionado
                          ? opcao.corAtiva
                          : 'border-slate-300 bg-white hover:border-[#111315]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-display font-bold text-sm uppercase">
                          {opcao.icone}
                          <span>{opcao.titulo}</span>
                        </span>
                        <input
                          type="radio"
                          name="dsSituacao"
                          value={opcao.valor}
                          checked={selecionado}
                          onChange={() => setDsSituacao(opcao.valor)}
                          className="w-4 h-4 accent-[#0052CC]"
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {opcao.desc}
                      </p>
                    </label>
                  );
                })}
              </div>
              {erros.dsSituacao && (
                <p role="alert" className="mt-1 text-xs font-bold text-red-700">
                  {erros.dsSituacao}
                </p>
              )}
            </fieldset>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="relato-observacao"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  4. O que você observou no local? *
                </label>
                <span className="font-mono text-xs text-slate-500">
                  {dsObservacao.trim().length} caracteres (mín. 10)
                </span>
              </div>
              <textarea
                id="relato-observacao"
                rows={4}
                required
                value={dsObservacao}
                onChange={(e) => {
                  setDsObservacao(e.target.value);
                  if (erros.dsObservacao) {
                    setErros({ ...erros, dsObservacao: undefined });
                  }
                }}
                aria-invalid={Boolean(erros.dsObservacao)}
                placeholder="Ex.: Guia rebaixada livre e piso tátil contínuo, ou degrau alto na entrada principal..."
                className={`w-full px-3.5 py-2.5 border text-sm ${
                  erros.dsObservacao ? 'border-red-600 bg-red-50/40' : 'border-slate-400'
                }`}
              />
              {erros.dsObservacao && (
                <p role="alert" className="mt-1 text-xs font-bold text-red-700">
                  {erros.dsObservacao}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Link
                to="/locais"
                className="text-center px-4 py-2.5 border-2 border-[#111315] text-[#111315] hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition hc-card"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-3 bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-60 text-white text-xs font-extrabold uppercase tracking-wider border-2 border-[#111315] shadow-[2px_2px_0px_#111315] transition"
              >
                {enviando ? 'Publicando avaliação...' : 'Publicar Avaliação'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
