import React, { useState } from 'react';
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

export const RadarMap: React.FC<RadarMapProps> = ({
  locais,
  latCentro,
  lonCentro,
  raioKm,
  usarFiltroRaio,
}) => {
  const [selectedLocalId, setSelectedLocalId] = useState<number | null>(
    locais.length > 0 ? locais[0].cdLocal : null
  );

  const selectedLocal =
    locais.find((l) => l.cdLocal === selectedLocalId) ?? locais[0] ?? null;

  const alcanceKmVisual = usarFiltroRaio ? Math.max(1, raioKm) : 8;
  const maxDeltaGraus = alcanceKmVisual * 0.0095;

  const projetarCoordenada = (lat: number, lon: number) => {
    const dLat = lat - latCentro;
    const dLon = lon - lonCentro;

    const normX = Math.max(-0.92, Math.min(0.92, dLon / maxDeltaGraus));
    const normY = Math.max(-0.92, Math.min(0.92, -dLat / maxDeltaGraus));

    const cx = 200 + normX * 145;
    const cy = 160 + normY * 125;
    return { cx, cy };
  };

  return (
    <section
      aria-label="Diagrama espacial de pontos mapeados"
      className="bg-white border-2 border-[#111315] p-4 sm:p-6 hc-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-[#111315]">
            Painel Geográfico de Proximidade
          </h2>
          <p className="font-mono text-xs text-slate-600">
            Referência central: ({latCentro.toFixed(4)}, {lonCentro.toFixed(4)}) · Alcance:{' '}
            {alcanceKmVisual} km
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-600 inline-block border border-[#111315]" />
            Acessível
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#F5B700] inline-block border border-[#111315]" />
            Parcial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-600 inline-block border border-[#111315]" />
            Inacessível
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-400 inline-block border border-[#111315]" />
            Sem avaliação
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 bg-[#111315] p-2 border border-[#111315] relative overflow-hidden">
          <svg
            viewBox="0 0 400 320"
            role="img"
            aria-label={`Diagrama espacial exibindo ${locais.length} pontos próximos à coordenada de referência`}
            className="w-full h-64 sm:h-72 block"
          >
            <title>Diagrama espacial de locais acessíveis e barreiras</title>
            <line x1="200" y1="10" x2="200" y2="310" stroke="#26292E" strokeDasharray="3 3" />
            <line x1="20" y1="160" x2="380" y2="160" stroke="#26292E" strokeDasharray="3 3" />

            <circle cx="200" cy="160" r="45" fill="none" stroke="#26292E" strokeWidth="1" />
            <circle cx="200" cy="160" r="90" fill="none" stroke="#26292E" strokeWidth="1" />
            <circle
              cx="200"
              cy="160"
              r="135"
              fill="none"
              stroke="#F5B700"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            <text x="206" y="32" fill="#F5B700" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {alcanceKmVisual.toFixed(1)} km
            </text>
            <text x="206" y="76" fill="#64748b" fontSize="8" fontFamily="monospace">
              {(alcanceKmVisual * 0.66).toFixed(1)} km
            </text>
            <text x="206" y="120" fill="#64748b" fontSize="8" fontFamily="monospace">
              {(alcanceKmVisual * 0.33).toFixed(1)} km
            </text>

            <rect
              x="195"
              y="155"
              width="10"
              height="10"
              fill="#0052CC"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="210" y="163" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
              ORIGEM
            </text>

            {locais.map((local) => {
              const { cx, cy } = projetarCoordenada(local.vlLatitude, local.vlLongitude);
              const nivel = calcularNivelAcessibilidade(local);
              const isSelected = selectedLocal?.cdLocal === local.cdLocal;

              const fillPin =
                nivel.situacao === 'ACESSIVEL'
                  ? '#10b981'
                  : nivel.situacao === 'PARCIAL'
                    ? '#F5B700'
                    : nivel.situacao === 'INACESSIVEL'
                      ? '#ef4444'
                      : '#94a3b8';

              return (
                <g
                  key={local.cdLocal}
                  tabIndex={0}
                  role="button"
                  aria-label={`${local.nmLocal} — ${formatarLabelSituacao(nivel.situacao)}`}
                  onClick={() => setSelectedLocalId(local.cdLocal)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedLocalId(local.cdLocal);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="13"
                      fill="none"
                      stroke="#F5B700"
                      strokeWidth="2"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 7.5 : 6}
                    fill={fillPin}
                    stroke="#111315"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-[#F4F4F0] border border-slate-300 p-4 flex flex-col justify-between hc-card">
          {selectedLocal ? (
            (() => {
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
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#111315] text-white font-mono text-[11px] font-bold uppercase">
                      {formatarLabelTipoLocal(tipo)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#111315]">
                      <IconPin className="w-3.5 h-3.5 text-[#0052CC]" />
                      {dist.toFixed(2)} km
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#111315]">
                    {selectedLocal.nmLocal}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedLocal.dsEndereco}</p>

                  <div className="mt-3 p-3 bg-white border border-slate-300 text-xs space-y-1.5 hc-card">
                    <p>
                      <strong>Condição (30 dias):</strong>{' '}
                      {formatarLabelSituacao(nivel.situacao)}{' '}
                      {nivel.pontuacao !== null ? `(${nivel.pontuacao}%)` : ''}
                    </p>
                    <p>
                      <strong>Validação:</strong>{' '}
                      {nivel.confirmado
                        ? `Confirmado (${nivel.usuariosDistintos30Dias} pessoas)`
                        : `Em análise (${nivel.usuariosDistintos30Dias}/3 pessoas)`}
                    </p>
                    <p>
                      <strong>Medidas:</strong> inclinação {selectedLocal.vlInclinacaoPct}% · largura{' '}
                      {selectedLocal.vlLarguraCm} cm
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`/locais/${selectedLocal.cdLocal}`}
                      className="flex-1 text-center px-3 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider transition"
                    >
                      Ver detalhes
                    </Link>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLocal.vlLatitude},${selectedLocal.vlLongitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-[#111315] text-[#111315] text-xs font-bold hover:bg-slate-100 transition hc-card"
                    >
                      <span>Maps</span>
                      <IconExternal />
                    </a>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center my-auto py-8 text-xs text-slate-500">
              Selecione um ponto no diagrama ao lado.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
