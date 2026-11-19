import React, { useEffect, useState } from 'react';
import { IconCheck, IconContrast } from './Icons';

export const AccessibilityBar: React.FC = () => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('rotalivre_hc') === 'true';
  });

  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = Number(localStorage.getItem('rotalivre_font_scale'));
    return saved === 112.5 || saved === 125 ? saved : 100;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('rotalivre_hc', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    localStorage.setItem('rotalivre_font_scale', String(fontScale));
  }, [fontScale]);

  return (
    <div
      role="region"
      aria-label="Opções de leitura e acessibilidade"
      className="bg-slate-900 text-white border-b border-slate-700 text-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a
            href="#conteudo-principal"
            className="sr-only focus:not-sr-only focus:bg-yellow-400 focus:text-slate-950 focus:px-3 focus:py-1.5 rounded font-bold"
          >
            Ir direto para o conteúdo principal
          </a>
          <span className="hidden sm:inline text-slate-200">
            Ajustes de leitura da página:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setHighContrast((prev) => !prev)}
            aria-pressed={highContrast}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold border ${
              highContrast
                ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                : 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700'
            }`}
          >
            {highContrast ? <IconCheck /> : <IconContrast />}
            <span>{highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}</span>
          </button>

          <div
            role="group"
            aria-label="Mudar o tamanho da letra"
            className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setFontScale(100)}
              aria-pressed={fontScale === 100}
              className={`px-3 py-1.5 font-bold ${
                fontScale === 100
                  ? 'bg-[#0047B3] text-white'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
              aria-label="Letra em tamanho normal"
            >
              Letra normal
            </button>
            <button
              type="button"
              onClick={() => setFontScale(112.5)}
              aria-pressed={fontScale === 112.5}
              className={`px-3 py-1.5 font-bold border-l border-slate-600 ${
                fontScale === 112.5
                  ? 'bg-[#0047B3] text-white'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
              aria-label="Letra grande"
            >
              Letra grande
            </button>
            <button
              type="button"
              onClick={() => setFontScale(125)}
              aria-pressed={fontScale === 125}
              className={`px-3 py-1.5 font-bold border-l border-slate-600 ${
                fontScale === 125
                  ? 'bg-[#0047B3] text-white'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
              aria-label="Letra extra grande"
            >
              Letra maior
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
