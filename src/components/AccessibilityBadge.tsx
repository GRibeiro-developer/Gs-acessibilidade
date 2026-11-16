import React from 'react';
import { NivelAcessibilidadeCalculado } from '../types';
import { formatarLabelSituacao } from '../services/acessibilidadeCalc';
import {
  IconAlert,
  IconBlock,
  IconCheck,
  IconClock,
  IconShieldCheck,
} from './Icons';

interface AccessibilityBadgeProps {
  nivel: NivelAcessibilidadeCalculado;
  showDetails?: boolean;
}

export const AccessibilityBadge: React.FC<AccessibilityBadgeProps> = ({
  nivel,
  showDetails = true,
}) => {
  const {
    situacao,
    pontuacao,
    confirmado,
    usuariosDistintos30Dias,
    totalRelatos30Dias,
  } = nivel;

  const badgeColors =
    situacao === 'ACESSIVEL'
      ? 'bg-emerald-50 text-emerald-950 border-emerald-700'
      : situacao === 'PARCIAL'
        ? 'bg-amber-100 text-amber-950 border-amber-700'
        : situacao === 'INACESSIVEL'
          ? 'bg-red-50 text-red-950 border-red-700'
          : 'bg-slate-100 text-slate-800 border-slate-400';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold border ${badgeColors} hc-card`}
      >
        {situacao === 'ACESSIVEL' && <IconCheck />}
        {situacao === 'PARCIAL' && <IconAlert />}
        {situacao === 'INACESSIVEL' && <IconBlock />}
        <span>{formatarLabelSituacao(situacao)}</span>
        {pontuacao !== null && <span>({pontuacao}%)</span>}
      </span>

      {showDetails && situacao !== 'SEM_RELATOS' && (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border ${
            confirmado
              ? 'bg-blue-50 text-[#0047B3] border-[#0047B3]'
              : 'bg-slate-100 text-slate-800 border-slate-400'
          } hc-card`}
        >
          {confirmado ? <IconShieldCheck /> : <IconClock />}
          <span>{confirmado ? 'Confirmado' : 'Em validação'}</span>
          <span>
            ({usuariosDistintos30Dias} de 3 pessoas · {totalRelatos30Dias}{' '}
            {totalRelatos30Dias === 1 ? 'relato' : 'relatos'})
          </span>
        </span>
      )}
    </div>
  );
};
