import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocalAcessivel } from '../types';
import {
  calcularDistanciaHaversineKm,
  calcularNivelAcessibilidade,
  formatarLabelSituacao,
  formatarLabelTipoLocal,
  obterNomeTipoLocal,
} from '../services/acessibilidadeCalc';
import { IconExternal, IconPin } from './Icons';

interface RadarMapProps {
  locais: LocalAcessivel[];
  latCentro: number;
  lonCentro: number;
  raioKm: number;
  usarFiltroRaio: boolean;
}

/**
 * Mapa Interativo Real com Google Maps Embed + Lista Rápida de Pontos Mapeados.
 * Não utiliza bibliotecas externas proibidas na rubrica (usa <iframe> oficial do Google Maps).
 */
export const RadarMap: React.FC<RadarMapProps> = ({
  locais,
  latCentro,
  lonCentro,
}) => {
  const [selectedLocalId, setSelectedLocalId] = useState<number | null>(
    locais.length > 0 ? locais[0].cdLocal : null
  );

  useEffect(() => {
    if (
      locais.length > 0 &&
      !locais.some((l) => l.cdLocal === selectedLocalId)
    ) {
      setSelectedLocalId(locais[0].cdLocal);
    }
  }, [locais, selectedLocalId]);

  const selectedLocal =
    locais.find((l) => l.cdLocal === selectedLocalId) ?? locais[0] ?? null;

  const latMapa = selectedLocal ? selectedLocal.vlLatitude : latCentro;
  const lonMapa = selectedLocal ? selectedLocal.vlLongitude : lonCentro;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${latMapa},${lonMapa}&z=16&hl=pt-BR&output=embed`;

  return (
    <section
      aria-label="Mapa do Google Maps com os locais cadastrados"
      className="bg-white border border-slate-300 rounded-xl p-4 sm:p-6 hc-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Visualização no Google Maps
          </h2>
          <p className="text-sm text-slate-700 mt-0.5">
            Selecione qualquer local ao lado para ver a rua exata no mapa abaixo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            Acessível
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            Parcial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
            Inacessível
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Coluna do Google Maps Real */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 min-h-[320px] sm:min-h-[380px]">
          <iframe
            title={
              selectedLocal
                ? `Mapa do Google mostrando ${selectedLocal.nmLocal} em ${selectedLocal.dsEndereco}`
                : 'Mapa do Google mostrando a região selecionada'
            }
            src={googleMapsEmbedUrl}
            className="w-full h-80 sm:h-96 border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Coluna de seleção rápida do ponto e resumo */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-4">
          {selectedLocal && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              {(() => {
                const nivel = calcularNivelAcessibilidade(selectedLocal);
                const dist = calcularDistanciaHaversineKm(
                  latCentro,
                  lonCentro,
                  selectedLocal.vlLatitude,
                  selectedLocal.vlLongitude
                );
                const tipo = obterNomeTipoLocal(
                  selectedLocal.cdTipoLocal,
                  selectedLocal.nmTipoLocal
                );
                return (
                  <>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded bg-[#0047B3] text-white text-xs font-bold">
                        {formatarLabelTipoLocal(tipo)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                        <IconPin className="w-3.5 h-3.5 text-[#0047B3]" />
                        A {dist.toFixed(2)} km
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {selectedLocal.nmLocal}
                    </h3>
                    <p className="text-sm text-slate-700 mt-0.5">
                      {selectedLocal.dsEndereco}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-sm space-y-1 text-slate-800">
                      <p>
                        <strong>Condição:</strong> {formatarLabelSituacao(nivel.situacao)}{' '}
                        {nivel.pontuacao !== null ? `(${nivel.pontuacao}%)` : ''}
                      </p>
                      <p>
                        <strong>Inclinação / Largura:</strong> {selectedLocal.vlInclinacaoPct}% ·{' '}
                        {selectedLocal.vlLarguraCm} cm
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to={`/locais/${selectedLocal.cdLocal}`}
                        className="flex-1 text-center px-3 py-2 rounded-lg bg-[#0047B3] hover:bg-blue-800 text-white text-xs font-bold"
                      >
                        Abrir ficha deste local
                      </Link>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedLocal.vlLatitude},${selectedLocal.vlLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold hover:bg-slate-100 hc-card"
                      >
                        <span>Ampliar mapa</span>
                        <IconExternal />
                      </a>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Lista clicável para trocar o ponto focado no Google Maps */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-white hc-card">
            <div className="px-3.5 py-2 bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 hc-card">
              Clique em um local para focar no mapa ({locais.length}):
            </div>
            <div className="max-h-44 overflow-y-auto divide-y divide-slate-200">
              {locais.map((local) => {
                const isSelected = selectedLocal?.cdLocal === local.cdLocal;
                const nivel = calcularNivelAcessibilidade(local);
                const dotColor =
                  nivel.situacao === 'ACESSIVEL'
                    ? 'bg-emerald-600'
                    : nivel.situacao === 'PARCIAL'
                      ? 'bg-amber-500'
                      : nivel.situacao === 'INACESSIVEL'
                        ? 'bg-red-600'
                        : 'bg-slate-400';

                return (
                  <button
                    key={local.cdLocal}
                    type="button"
                    onClick={() => setSelectedLocalId(local.cdLocal)}
                    className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 transition ${
                      isSelected
                        ? 'bg-blue-50 text-[#0047B3] font-bold hc-card'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{local.nmLocal}</span>
                    </span>
                    <span className="text-xs text-slate-500 shrink-0">
                      Ver no mapa
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
