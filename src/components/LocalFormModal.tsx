import React, { useState } from 'react';
import { LocalAcessivel, NovoLocalDTO, StatusAtivo } from '../types';
import { PONTOS_REFERENCIA_SP, TIPOS_LOCAL_CATALOGO } from '../data/integrantes';
import { ApiException } from '../services/api';
import { formatarLabelTipoLocal } from '../services/acessibilidadeCalc';
import { IconPin } from './Icons';

interface LocalFormModalProps {
  modo: 'criar' | 'editar';
  localInicial?: LocalAcessivel;
  onClose: () => void;
  onSubmit: (dto: NovoLocalDTO) => Promise<void>;
}

export const LocalFormModal: React.FC<LocalFormModalProps> = ({
  modo,
  localInicial,
  onClose,
  onSubmit,
}) => {
  const [cdTipoLocal, setCdTipoLocal] = useState<number>(
    localInicial?.cdTipoLocal ?? 1
  );
  const [nmLocal, setNmLocal] = useState<string>(localInicial?.nmLocal ?? '');
  const [dsEndereco, setDsEndereco] = useState<string>(
    localInicial?.dsEndereco ?? ''
  );
  const [vlLatitude, setVlLatitude] = useState<string>(
    localInicial ? String(localInicial.vlLatitude) : String(PONTOS_REFERENCIA_SP[0].lat)
  );
  const [vlLongitude, setVlLongitude] = useState<string>(
    localInicial ? String(localInicial.vlLongitude) : String(PONTOS_REFERENCIA_SP[0].lon)
  );
  const [vlInclinacaoPct, setVlInclinacaoPct] = useState<string>(
    localInicial ? String(localInicial.vlInclinacaoPct) : '5'
  );
  const [vlLarguraCm, setVlLarguraCm] = useState<string>(
    localInicial ? String(localInicial.vlLarguraCm) : '150'
  );
  const [stAtivo, setStAtivo] = useState<StatusAtivo>(
    localInicial?.stAtivo ?? 'S'
  );

  const [mostrarCoordenadasManuais, setMostrarCoordenadasManuais] =
    useState<boolean>(false);
  const [statusLocalizacao, setStatusLocalizacao] = useState<string | null>(null);

  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<boolean>(false);

  const handleUsarGpsNoCadastro = () => {
    if (!navigator.geolocation) {
      setStatusLocalizacao('Seu navegador não suporta localização automática.');
      return;
    }
    setStatusLocalizacao('Obtendo sua localização atual...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVlLatitude(String(Number(pos.coords.latitude.toFixed(5))));
        setVlLongitude(String(Number(pos.coords.longitude.toFixed(5))));
        setStatusLocalizacao('Localização atual preenchida com sucesso.');
      },
      () => {
        setStatusLocalizacao(
          'Não foi possível obter o GPS. Escolha uma região na lista acima.'
        );
      }
    );
  };

  const validarFormulario = (): NovoLocalDTO | null => {
    const novosErros: Record<string, string> = {};

    if (!nmLocal.trim() || nmLocal.trim().length < 3) {
      novosErros.nmLocal = 'Informe o nome ou identificação do local (mínimo de 3 letras).';
    }
    if (!dsEndereco.trim() || dsEndereco.trim().length < 5) {
      novosErros.dsEndereco = 'Informe o endereço ou ponto de referência.';
    }

    const latNum = Number(vlLatitude.replace(',', '.'));
    if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
      novosErros.vlLatitude = 'Localização inválida.';
    }

    const lonNum = Number(vlLongitude.replace(',', '.'));
    if (Number.isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      novosErros.vlLongitude = 'Localização inválida.';
    }

    const incNum = Number(vlInclinacaoPct.replace(',', '.'));
    if (Number.isNaN(incNum) || incNum < 0 || incNum > 100) {
      novosErros.vlInclinacaoPct = 'A inclinação deve estar entre 0% e 100%.';
    }

    const largNum = Number(vlLarguraCm.replace(',', '.'));
    if (Number.isNaN(largNum) || largNum <= 0) {
      novosErros.vlLarguraCm = 'A largura livre em centímetros deve ser maior que zero.';
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      return null;
    }

    return {
      cdTipoLocal,
      nmLocal: nmLocal.trim(),
      dsEndereco: dsEndereco.trim(),
      vlLatitude: latNum,
      vlLongitude: lonNum,
      vlInclinacaoPct: incNum,
      vlLarguraCm: largNum,
      stAtivo,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroApi(null);

    const dto = validarFormulario();
    if (!dto) return;

    try {
      setEnviando(true);
      await onSubmit(dto);
      onClose();
    } catch (err) {
      if (err instanceof ApiException) {
        setErroApi(`${err.message} (Código ${err.status || 'Rede'})`);
        if (err.fields) {
          setErros((prev) => ({ ...prev, ...err.fields }));
        }
      } else {
        setErroApi('Não foi possível salvar os dados do local.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-local-titulo"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-slate-300 rounded-xl max-w-xl w-full p-6 my-8 shadow-xl hc-card">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <h2 id="modal-local-titulo" className="text-xl font-bold text-slate-900">
            {modo === 'criar'
              ? 'Cadastrar novo local no mapa'
              : `Editar local #${localInicial?.cdLocal}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Fechar
          </button>
        </div>

        {erroApi && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-600 text-red-950 text-sm font-semibold"
          >
            {erroApi}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="campo-tipo-local"
                className="block text-sm font-bold text-slate-900 mb-1"
              >
                Tipo de local *
              </label>
              <select
                id="campo-tipo-local"
                value={cdTipoLocal}
                onChange={(e) => setCdTipoLocal(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-400 text-base bg-white"
              >
                {TIPOS_LOCAL_CATALOGO.map((t) => (
                  <option key={t.cdTipoLocal} value={t.cdTipoLocal}>
                    {formatarLabelTipoLocal(t.nmTipoLocal)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="campo-status-ativo"
                className="block text-sm font-bold text-slate-900 mb-1"
              >
                Situação do local *
              </label>
              <select
                id="campo-status-ativo"
                value={stAtivo}
                onChange={(e) => setStAtivo(e.target.value as StatusAtivo)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-400 text-base bg-white"
              >
                <option value="S">Ativo (aberto para passagem)</option>
                <option value="N">Desativado</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="campo-nm-local"
              className="block text-sm font-bold text-slate-900 mb-1"
            >
              Nome do local *
            </label>
            <input
              id="campo-nm-local"
              type="text"
              required
              value={nmLocal}
              onChange={(e) => setNmLocal(e.target.value)}
              aria-invalid={Boolean(erros.nmLocal)}
              placeholder="Ex.: Rampa da Av. Paulista com a Rua Augusta"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-400 text-base"
            />
            {erros.nmLocal && (
              <p className="mt-1 text-sm font-bold text-red-700">{erros.nmLocal}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="campo-ds-endereco"
              className="block text-sm font-bold text-slate-900 mb-1"
            >
              Endereço ou ponto de referência *
            </label>
            <input
              id="campo-ds-endereco"
              type="text"
              required
              value={dsEndereco}
              onChange={(e) => setDsEndereco(e.target.value)}
              aria-invalid={Boolean(erros.dsEndereco)}
              placeholder="Ex.: Av. Paulista, 1106 — Bela Vista, São Paulo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-400 text-base"
            />
            {erros.dsEndereco && (
              <p className="mt-1 text-sm font-bold text-red-700">{erros.dsEndereco}</p>
            )}
          </div>

          {/* Seleção simples de região sem exigir que o usuário saiba latitude/longitude */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-300 space-y-2.5 hc-card">
            <label
              htmlFor="select-regiao-cadastro"
              className="block text-sm font-bold text-slate-900"
            >
              Região aproximada no mapa
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                id="select-regiao-cadastro"
                onChange={(e) => {
                  const ref = PONTOS_REFERENCIA_SP[Number(e.target.value)];
                  if (ref) {
                    setVlLatitude(String(ref.lat));
                    setVlLongitude(String(ref.lon));
                    setStatusLocalizacao(`Região selecionada: ${ref.nome}`);
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-400 text-sm bg-white font-semibold"
              >
                {PONTOS_REFERENCIA_SP.map((p, idx) => (
                  <option key={p.nome} value={idx}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleUsarGpsNoCadastro}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-400 text-slate-900 text-xs font-bold hover:bg-slate-100 shrink-0 hc-card"
              >
                <IconPin className="w-4 h-4 text-[#0047B3]" />
                <span>Usar minha localização</span>
              </button>
            </div>

            {statusLocalizacao && (
              <p className="text-xs font-semibold text-[#0047B3] hc-accent">
                {statusLocalizacao}
              </p>
            )}

            <button
              type="button"
              onClick={() => setMostrarCoordenadasManuais((prev) => !prev)}
              className="text-xs text-slate-600 underline hover:text-slate-900"
            >
              {mostrarCoordenadasManuais
                ? 'Ocultar ajuste manual de coordenadas'
                : 'Informar latitude e longitude manualmente (opcional)'}
            </button>

            {mostrarCoordenadasManuais && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label
                    htmlFor="campo-vl-latitude"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Latitude
                  </label>
                  <input
                    id="campo-vl-latitude"
                    type="number"
                    step="any"
                    value={vlLatitude}
                    onChange={(e) => setVlLatitude(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-400 text-sm bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="campo-vl-longitude"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Longitude
                  </label>
                  <input
                    id="campo-vl-longitude"
                    type="number"
                    step="any"
                    value={vlLongitude}
                    onChange={(e) => setVlLongitude(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-400 text-sm bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="campo-inclinacao"
                className="block text-sm font-bold text-slate-900 mb-1"
              >
                Inclinação da rampa (%) *
              </label>
              <input
                id="campo-inclinacao"
                type="number"
                step="0.1"
                min={0}
                max={100}
                required
                value={vlInclinacaoPct}
                onChange={(e) => setVlInclinacaoPct(e.target.value)}
                aria-invalid={Boolean(erros.vlInclinacaoPct)}
                className="w-full px-3 py-2 rounded-lg border border-slate-400 text-base"
              />
              <span className="block text-xs text-slate-600 mt-1">
                O ideal para cadeira de rodas é até 8%.
              </span>
              {erros.vlInclinacaoPct && (
                <p className="mt-1 text-sm font-bold text-red-700">
                  {erros.vlInclinacaoPct}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="campo-largura"
                className="block text-sm font-bold text-slate-900 mb-1"
              >
                Largura livre da passagem (cm) *
              </label>
              <input
                id="campo-largura"
                type="number"
                step="1"
                min={1}
                required
                value={vlLarguraCm}
                onChange={(e) => setVlLarguraCm(e.target.value)}
                aria-invalid={Boolean(erros.vlLarguraCm)}
                className="w-full px-3 py-2 rounded-lg border border-slate-400 text-base"
              />
              <span className="block text-xs text-slate-600 mt-1">
                O ideal em calçadas é pelo menos 120 cm livres.
              </span>
              {erros.vlLarguraCm && (
                <p className="mt-1 text-sm font-bold text-red-700">
                  {erros.vlLarguraCm}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="px-4 py-2.5 rounded-lg border border-slate-400 text-slate-900 text-sm font-bold hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2.5 rounded-lg bg-[#0047B3] hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-bold"
            >
              {enviando
                ? 'Salvando...'
                : modo === 'criar'
                  ? 'Salvar novo local'
                  : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
