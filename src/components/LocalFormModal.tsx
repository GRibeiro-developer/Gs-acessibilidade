import React, { useState } from 'react';
import { LocalAcessivel, NovoLocalDTO, StatusAtivo } from '../types';
import { TIPOS_LOCAL_CATALOGO } from '../data/integrantes';
import { ApiException } from '../services/api';
import { formatarLabelTipoLocal } from '../services/acessibilidadeCalc';

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
    localInicial ? String(localInicial.vlLatitude) : '-23.5641'
  );
  const [vlLongitude, setVlLongitude] = useState<string>(
    localInicial ? String(localInicial.vlLongitude) : '-46.6524'
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

  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<boolean>(false);

  const validarFormulario = (): NovoLocalDTO | null => {
    const novosErros: Record<string, string> = {};

    if (!nmLocal.trim() || nmLocal.trim().length < 3) {
      novosErros.nmLocal = 'Informe o nome ou identificação do local (mínimo de 3 caracteres).';
    }
    if (!dsEndereco.trim() || dsEndereco.trim().length < 5) {
      novosErros.dsEndereco = 'Informe o endereço ou ponto de referência.';
    }

    const latNum = Number(vlLatitude.replace(',', '.'));
    if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
      novosErros.vlLatitude = 'A latitude deve estar entre -90 e 90.';
    }

    const lonNum = Number(vlLongitude.replace(',', '.'));
    if (Number.isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      novosErros.vlLongitude = 'A longitude deve estar entre -180 e 180.';
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
        setErroApi(`${err.message} (HTTP ${err.status || 'Rede'})`);
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
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border-2 border-[#111315] max-w-xl w-full p-6 my-8 hc-card">
        <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-[#111315]">
          <h2 id="modal-local-titulo" className="font-display text-xl font-bold text-[#111315]">
            {modo === 'criar'
              ? 'Cadastrar Novo Ponto Urbano'
              : `Editar Ponto #${localInicial?.cdLocal}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="px-2.5 py-1 border border-[#111315] text-xs font-mono font-bold hover:bg-slate-100"
          >
            FECHAR
          </button>
        </div>

        {erroApi && (
          <div
            role="alert"
            className="mt-4 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-900 text-xs font-semibold"
          >
            {erroApi}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="campo-tipo-local"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Categoria *
              </label>
              <select
                id="campo-tipo-local"
                value={cdTipoLocal}
                onChange={(e) => setCdTipoLocal(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-400 text-sm bg-white"
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
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Situação do Cadastro *
              </label>
              <select
                id="campo-status-ativo"
                value={stAtivo}
                onChange={(e) => setStAtivo(e.target.value as StatusAtivo)}
                className="w-full px-3 py-2 border border-slate-400 text-sm bg-white"
              >
                <option value="S">Ativo para consulta</option>
                <option value="N">Inativo / Desativado</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="campo-nm-local"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              Identificação do Local *
            </label>
            <input
              id="campo-nm-local"
              type="text"
              required
              value={nmLocal}
              onChange={(e) => setNmLocal(e.target.value)}
              aria-invalid={Boolean(erros.nmLocal)}
              placeholder="Ex.: Travessia Av. Paulista com Rua Augusta"
              className="w-full px-3 py-2 border border-slate-400 text-sm"
            />
            {erros.nmLocal && (
              <p className="mt-1 text-xs font-semibold text-red-700">{erros.nmLocal}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="campo-ds-endereco"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              Endereço ou Referência *
            </label>
            <input
              id="campo-ds-endereco"
              type="text"
              required
              value={dsEndereco}
              onChange={(e) => setDsEndereco(e.target.value)}
              aria-invalid={Boolean(erros.dsEndereco)}
              placeholder="Ex.: Av. Paulista, 1106 — Bela Vista, São Paulo"
              className="w-full px-3 py-2 border border-slate-400 text-sm"
            />
            {erros.dsEndereco && (
              <p className="mt-1 text-xs font-semibold text-red-700">{erros.dsEndereco}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="campo-vl-latitude"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Latitude *
              </label>
              <input
                id="campo-vl-latitude"
                type="number"
                step="any"
                required
                value={vlLatitude}
                onChange={(e) => setVlLatitude(e.target.value)}
                aria-invalid={Boolean(erros.vlLatitude)}
                className="w-full px-3 py-2 border border-slate-400 text-sm font-mono"
              />
              {erros.vlLatitude && (
                <p className="mt-1 text-xs font-semibold text-red-700">{erros.vlLatitude}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="campo-vl-longitude"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Longitude *
              </label>
              <input
                id="campo-vl-longitude"
                type="number"
                step="any"
                required
                value={vlLongitude}
                onChange={(e) => setVlLongitude(e.target.value)}
                aria-invalid={Boolean(erros.vlLongitude)}
                className="w-full px-3 py-2 border border-slate-400 text-sm font-mono"
              />
              {erros.vlLongitude && (
                <p className="mt-1 text-xs font-semibold text-red-700">{erros.vlLongitude}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="campo-inclinacao"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Inclinação da Rampa/Via (%) *
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
                className="w-full px-3 py-2 border border-slate-400 text-sm font-mono"
              />
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Limite recomendado pela NBR 9050: até 8,33%.
              </span>
              {erros.vlInclinacaoPct && (
                <p className="mt-1 text-xs font-semibold text-red-700">
                  {erros.vlInclinacaoPct}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="campo-largura"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
              >
                Largura Livre de Passagem (cm) *
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
                className="w-full px-3 py-2 border border-slate-400 text-sm font-mono"
              />
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Faixa livre recomendada pela NBR 9050: mínimo 120 cm.
              </span>
              {erros.vlLarguraCm && (
                <p className="mt-1 text-xs font-semibold text-red-700">
                  {erros.vlLarguraCm}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="px-4 py-2 border border-[#111315] text-[#111315] text-xs font-bold uppercase hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition"
            >
              {enviando
                ? 'Salvando...'
                : modo === 'criar'
                  ? 'Cadastrar Ponto'
                  : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
