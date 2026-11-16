import React from 'react';
import { Link } from 'react-router-dom';
import { IconRouteLogo } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#0047B3] text-white flex items-center justify-center">
                <IconRouteLogo className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">Rotalivre</span>
            </div>
            <p className="text-base text-slate-300 leading-relaxed">
              Site colaborativo para consultar e avisar se calçadas, rampas, elevadores e comércios
              têm passagem livre e segura.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-3">
              Páginas do site
            </h2>
            <ul className="space-y-2.5 text-base">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white underline">
                  Página inicial
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-slate-300 hover:text-white underline">
                  Como o projeto funciona
                </Link>
              </li>
              <li>
                <Link to="/integrantes" className="text-slate-300 hover:text-white underline">
                  Conhecer a equipe
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-white underline">
                  Dúvidas comuns
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-slate-300 hover:text-white underline">
                  Falar com a equipe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-3">
              Consultar e avaliar
            </h2>
            <ul className="space-y-2.5 text-base">
              <li>
                <Link to="/locais" className="text-slate-300 hover:text-white underline">
                  Ver lista e mapa de locais
                </Link>
              </li>
              <li>
                <Link to="/relatos/novo" className="text-slate-300 hover:text-white underline">
                  Avaliar uma calçada ou local
                </Link>
              </li>
              <li>
                <Link to="/locais?tipo=RAMPA" className="text-slate-300 hover:text-white underline">
                  Ver apenas rampas
                </Link>
              </li>
              <li>
                <Link to="/locais?tipo=ELEVADOR" className="text-slate-300 hover:text-white underline">
                  Ver apenas elevadores
                </Link>
              </li>
              <li>
                <Link to="/locais?tipo=OBSTACULO" className="text-slate-300 hover:text-white underline">
                  Ver alertas de buracos e obras
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-3">
              Metas da ONU atendidas
            </h2>
            <ul className="space-y-2 text-base text-slate-300">
              <li>• ODS 11: Cidades mais seguras e acessíveis</li>
              <li>• ODS 10: Menos desigualdade no dia a dia</li>
              <li>• ODS 9: Melhoria nas ruas e calçadas</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-300">
          <p>Time FreeRouter 2026</p>
          <p>Feito seguindo as regras de acessibilidade web (WCAG 2.1 AA) e a norma NBR 9050.</p>
        </div>
      </div>
    </footer>
  );
};
