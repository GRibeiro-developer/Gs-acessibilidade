import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export const NotFound: React.FC = () => {
  return (
    <div>
      <PageHeader
        badge="Erro 404"
        title="Página não encontrada"
        subtitle="O endereço acessado não corresponde a nenhuma página do Rotalivre."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Erro 404' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-white border-2 border-[#111315] p-8 hc-card">
          <p className="font-mono text-5xl font-bold text-[#0052CC] hc-accent">404</p>
          <p className="mt-2 font-display text-lg font-bold text-[#111315]">
            Endereço fora do mapa
          </p>
          <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
            Utilize os botões abaixo para voltar à página inicial ou consultar os locais mapeados.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider"
            >
              Página Inicial
            </Link>
            <Link
              to="/locais"
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#111315] border-2 border-[#111315] text-xs font-bold uppercase tracking-wider hc-card"
            >
              Mapa e Vias
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
