import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { INTEGRANTES_GRUPO } from '../data/integrantes';
import { IconArrowRight, IconExternal } from '../components/Icons';

export const Integrantes: React.FC = () => {
  return (
    <div>
      <PageHeader
        badge="Equipe 1TDSPW  · FIAP"
        title="Quem desenvolve o Rotalivre"
        subtitle="Estudantes responsáveis pelo desenvolvimento integrado do banco de dados, API Java, interface web, modelos de inteligência artificial e documentação de engenharia."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Equipe' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTEGRANTES_GRUPO.map((integrante) => (
            <article
              key={integrante.rm}
              className="bg-white border-2 border-[#111315] p-6 flex flex-col justify-between hc-card"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={integrante.fotoUrl}
                    alt={`Foto de ${integrante.nome} (RM ${integrante.rm})`}
                    className="w-16 h-16 object-cover border-2 border-[#111315] shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#111315] text-white font-mono text-xs font-bold">
                        RM {integrante.rm}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F4F4F0] text-slate-800 border border-slate-300 font-mono text-xs font-bold">
                        {integrante.turma}
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-display text-lg font-bold text-[#111315] leading-snug">
                      {integrante.nome}
                    </h2>
                    <p className="text-xs font-bold text-[#0052CC] mt-0.5 hc-accent">
                      {integrante.papel}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {integrante.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-1.5">
                  {integrante.habilidades.map((hab) => (
                    <span
                      key={hab}
                      className="px-2 py-0.5 bg-[#F4F4F0] border border-slate-300 text-slate-800 font-mono text-[11px] font-semibold"
                    >
                      {hab}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-[#111315] flex flex-wrap items-center justify-between gap-2">
                <Link
                  to={`/integrantes/${integrante.rm}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  <span>Ver perfil</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={integrante.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub de ${integrante.nome} (abre em nova aba)`}
                  className="inline-flex items-center gap-1 px-2.5 py-2 border border-[#111315] text-[#111315] hover:bg-slate-100 text-xs font-bold transition hc-card"
                >
                  <span>GitHub</span>
                  <IconExternal />
                </a>
                <a
                  href={integrante.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn de ${integrante.nome} (abre em nova aba)`}
                  className="inline-flex items-center gap-1 px-2.5 py-2 border border-[#111315] text-[#111315] hover:bg-slate-100 text-xs font-bold transition hc-card"
                >
                  <span>LinkedIn</span>
                  <IconExternal />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
