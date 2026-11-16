import React from 'react';
import { Link } from 'react-router-dom';
import { LocalAcessivel } from '../types';
import {
  calcularNivelAcessibilidade,
  formatarLabelTipoLocal,
  obterNomeTipoLocal,
} from '../services/acessibilidadeCalc';
import { AccessibilityBadge } from './AccessibilityBadge';
import { IconExternal, IconPin, IconPlus } from './Icons';

interface LocalCardProps {
  local: LocalAcessivel;
  distanciaKm?: number | null;
}

export const LocalCard: React.FC<LocalCardProps> = ({ local, distanciaKm }) => {
  const codigoTipo = obterNomeTipoLocal(local.cdTipoLocal, local.nmTipoLocal);
  const nivel = calcularNivelAcessibilidade(local);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${local.vlLatitude},${local.vlLongitude}`;

  const topStripeColor =
    nivel.situacao === 'ACESSIVEL'
      ? 'bg-emerald-700'
      : nivel.situacao === 'PARCIAL'
        ? 'bg-amber-500'
        : nivel.situacao === 'INACESSIVEL'
          ? 'bg-red-700'
          : 'bg-slate-400';

  return (
    <article className="bg-white border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between hc-card">
      <div>
        <div className={`h-2 w-full ${topStripeColor}`} aria-hidden="true" />
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 text-sm font-bold border border-slate-300 hc-card">
              {formatarLabelTipoLocal(codigoTipo)}
            </span>

            <div className="flex items-center gap-2">
              {distanciaKm !== undefined && distanciaKm !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#0047B3] text-sm font-bold border border-blue-200 hc-card">
                  <IconPin className="w-4 h-4" />
                  <span>A {distanciaKm.toFixed(2)} km</span>
                </span>
              )}

              {local.stAtivo === 'N' && (
                <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-xs font-bold">
                  Desativado
                </span>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            <Link
              to={`/locais/${local.cdLocal}`}
              className="hover:text-[#0047B3] hover:underline focus:outline-none"
            >
              {local.nmLocal}
            </Link>
          </h3>

          <p className="mt-1.5 text-base text-slate-700">{local.dsEndereco}</p>

          <div className="mt-4">
            <AccessibilityBadge nivel={nivel} />
          </div>

          <dl className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hc-card">
              <dt className="text-slate-600">Inclinação da rampa</dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {local.vlInclinacaoPct}%{' '}
                {local.vlInclinacaoPct <= 8.33 ? '(adequada)' : '(íngreme)'}
              </dd>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hc-card">
              <dt className="text-slate-600">Largura livre</dt>
              <dd className="font-bold text-slate-900 mt-0.5">
                {local.vlLarguraCm} cm
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-wrap items-center gap-2">
        <Link
          to={`/locais/${local.cdLocal}`}
          className="flex-1 text-center px-4 py-2.5 rounded-lg bg-[#0047B3] hover:bg-blue-800 text-white text-sm font-bold"
        >
          Abrir ficha deste local
        </Link>
        <Link
          to={`/relatos/novo?localId=${local.cdLocal}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold border border-slate-300 hc-card"
        >
          <IconPlus className="w-4 h-4" />
          <span>Avaliar</span>
        </Link>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver ${local.nmLocal} no Google Maps (abre em nova aba)`}
          className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold border border-slate-300 hc-card"
        >
          <span>Ver no mapa</span>
          <IconExternal />
        </a>
      </div>
    </article>
  );
};
