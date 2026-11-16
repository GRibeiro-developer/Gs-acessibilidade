import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { INTEGRANTES_GRUPO } from '../data/integrantes';
import { EmptyState } from '../components/StatusFeedback';
import { IconArrowLeft, IconExternal } from '../components/Icons';

export const IntegranteDetalhe: React.FC = () => {
  const { rm } = useParams<{ rm: string }>();

  const integrante = INTEGRANTES_GRUPO.find(
    (item) => item.rm.toLowerCase() === (rm ?? '').trim().toLowerCase()
  );

  if (!integrante) {
    return (
      <div>
        <PageHeader
          badge="Perfil de Integrante"
          title="Integrante não encontrado"
          subtitle={`Não encontramos nenhum integrante com o RM "${rm}".`}
          breadcrumbs={[
            { label: 'Início', to: '/' },
            { label: 'Equipe', to: '/integrantes' },
            { label: `RM ${rm}` },
          ]}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <EmptyState
            title={`RM ${rm} não localizado`}
            description="Verifique o número de matrícula informado no endereço ou volte para a página da equipe."
            action={
              <Link
                to="/integrantes"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider"
              >
                <IconArrowLeft />
                <span>Voltar para a Equipe</span>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        badge={`Ficha Individual · RM ${integrante.rm}`}
        title={integrante.nome}
        subtitle={`${integrante.papel} · Turma ${integrante.turma}`}
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Equipe', to: '/integrantes' },
          { label: integrante.nome },
        ]}
        actions={
          <Link
            to="/integrantes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-[#111315] text-xs font-bold uppercase border-2 border-[#111315] transition hc-card"
          >
            <IconArrowLeft />
            <span>Todos os Integrantes</span>
          </Link>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white border-2 border-[#111315] p-6 sm:p-8 hc-card">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={integrante.fotoUrl}
              alt={`Foto de ${integrante.nome}, RM ${integrante.rm}`}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-2 border-[#111315] shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#111315] text-white font-mono text-xs font-bold">
                  RM {integrante.rm}
                </span>
                <span className="px-2.5 py-1 bg-[#F4F4F0] text-[#111315] border border-slate-300 font-mono text-xs font-bold">
                  Turma {integrante.turma}
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#111315]">
                Responsabilidades no Projeto
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                {integrante.bio}
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F4F4F0] border border-slate-300 hc-card">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                    Frente Principal
                  </h3>
                  <p className="mt-1 text-sm font-bold text-[#111315]">
                    {integrante.frentePrincipal}
                  </p>
                </div>

                <div className="p-4 bg-[#F4F4F0] border border-slate-300 hc-card">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                    Apoio e Integração
                  </h3>
                  <ul className="mt-1 text-sm font-semibold text-slate-800 space-y-1">
                    {integrante.frentesApoio.map((apoio) => (
                      <li key={apoio}>• {apoio}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Tecnologias e Ferramentas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {integrante.habilidades.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white border border-[#111315] font-mono text-xs font-bold text-[#111315] hc-card"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap gap-3">
                <a
                  href={integrante.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#111315] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  <span>Perfil no GitHub</span>
                  <IconExternal />
                </a>
                <a
                  href={integrante.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  <span>Perfil no LinkedIn</span>
                  <IconExternal />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-2 border-[#111315] p-6 hc-card">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            Outros integrantes da equipe
          </h2>
          <div className="flex flex-wrap gap-2">
            {INTEGRANTES_GRUPO.map((outro) => (
              <Link
                key={outro.rm}
                to={`/integrantes/${outro.rm}`}
                className={`px-3 py-1.5 text-xs font-bold border transition ${
                  outro.rm === integrante.rm
                    ? 'bg-[#0052CC] text-white border-[#111315]'
                    : 'bg-[#F4F4F0] text-[#111315] border-slate-300 hover:border-[#111315] hc-card'
                }`}
              >
                {outro.nome} · RM {outro.rm}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
