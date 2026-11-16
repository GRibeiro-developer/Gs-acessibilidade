import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IconPlus, IconRouteLogo } from './Icons';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Início', end: true },
  { to: '/locais', label: 'Consultar locais' },
  { to: '/sobre', label: 'Como funciona' },
  { to: '/integrantes', label: 'Quem somos' },
  { to: '/faq', label: 'Dúvidas comuns' },
  { to: '/contato', label: 'Falar com a equipe' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-300 hc-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 focus:outline-none"
          aria-label="Rotalivre — Ir para a página inicial"
        >
          <div className="w-11 h-11 rounded-lg bg-[#0047B3] text-white flex items-center justify-center shrink-0">
            <IconRouteLogo className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xl font-extrabold text-slate-900">
              Rotalivre
            </span>
            <span className="block text-sm text-slate-700">
              Acessibilidade nas ruas
            </span>
          </div>
        </Link>

        {/* Navegação para computador */}
        <nav
          aria-label="Menu principal"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-lg text-base font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-[#0047B3] underline decoration-2 underline-offset-4 hc-card'
                    : 'text-slate-800 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <Link
            to="/relatos/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0047B3] hover:bg-blue-800 text-white text-base font-bold"
          >
            <IconPlus className="w-4 h-4" />
            <span>Avaliar um local</span>
          </Link>
        </div>

        {/* Botão de menu para celular e tablet */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/relatos/novo"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0047B3] text-white text-sm font-bold"
          >
            <IconPlus className="w-4 h-4" />
            <span>Avaliar local</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="menu-navegacao-mobile"
            className="px-3.5 py-2.5 rounded-lg border-2 border-slate-400 text-slate-900 bg-white font-bold text-sm"
          >
            {mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          </button>
        </div>
      </div>

      {/* Menu aberto no celular e tablet */}
      {mobileMenuOpen && (
        <nav
          id="menu-navegacao-mobile"
          aria-label="Menu principal para celular"
          className="lg:hidden bg-white border-t border-slate-300 px-4 py-4"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg text-base font-semibold ${
                      isActive
                        ? 'bg-blue-50 text-[#0047B3] font-bold hc-card'
                        : 'text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-slate-200">
              <Link
                to="/relatos/novo"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-[#0047B3] text-white text-base font-bold"
              >
                <IconPlus className="w-4 h-4" />
                <span>Avaliar uma calçada ou local</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
