import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { IconArrowRight } from '../components/Icons';

export const Sobre: React.FC = () => {
  return (
    <div>
      <PageHeader
        badge="Sobre a Plataforma"
        title="Por que criamos o Rotalivre"
        subtitle="Conectar quem precisa circular pela cidade com informações confiáveis sobre calçadas, rampas e elevadores, contribuindo diretamente para as metas de desenvolvimento urbano da ONU."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Projeto e ODS' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Seção 1: O Problema Urbano */}
        <section className="bg-white border-2 border-[#111315] p-6 sm:p-8 hc-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052CC] hc-accent">
                O Desafio nas Cidades Brasileiras
              </span>
              <h2 className="font-display text-2xl font-bold text-[#111315]">
                Mapas tradicionais mostram o caminho mais curto, mas não avisam se a calçada tem
                degrau ou buraco
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Aplicativos de navegação comuns partem do pressuposto de que qualquer calçada ou
                estação pode ser percorrida sem barreiras. Na prática, quem utiliza cadeira de
                rodas, bengala longa, andador ou carrinho de bebê descobre os obstáculos apenas
                quando já está no local.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Os dados do <strong>Censo Demográfico 2022 do IBGE</strong> mostram a dimensão real
                desse gargalo: apenas <strong>19,2%</strong> dos moradores urbanos têm rampas para
                cadeirantes nas calçadas do seu entorno, enquanto <strong>52,9%</strong> convivem
                com buracos, degraus ou postes estreitando a passagem.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#F4F4F0] border-2 border-[#111315] p-5 hc-card">
              <h3 className="font-display text-base font-bold text-[#111315] mb-3 pb-2 border-b border-slate-300">
                Parâmetros Técnicos Observados (ABNT NBR 9050)
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="border-l-2 border-[#0052CC] pl-3">
                  <strong className="block text-[#111315]">Inclinação Longitudinal (≤ 8,33%)</strong>
                  Rampas de acesso e guias rebaixadas devem respeitar o limite máximo de 8,33% para
                  permitir subida autônoma com cadeira de rodas.
                </li>
                <li className="border-l-2 border-[#0052CC] pl-3">
                  <strong className="block text-[#111315]">Faixa Livre de Passagem (≥ 120 cm)</strong>
                  Calçadas precisam manter largura livre recomendada de pelo menos 120 cm (mínimo
                  absoluto de 90 cm em pontos de estreitamento).
                </li>
                <li className="border-l-2 border-[#0052CC] pl-3">
                  <strong className="block text-[#111315]">Recursos de Apoio e Orientação</strong>
                  Presença e estado de conservação de piso tátil direcional/alerta, corrimão duplo,
                  banheiro adaptado, vaga PcD e semáforo sonoro.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Seção 2: Contribuição direta para as Metas dos ODS (11, 10 e 9) */}
        <section aria-labelledby="titulo-ods" className="space-y-5">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052CC] hc-accent">
              Compromisso com a Agenda 2030 da ONU
            </span>
            <h2 id="titulo-ods" className="font-display text-2xl font-bold text-[#111315] mt-1">
              Como o Rotalivre contribui na prática para as metas dos ODS 11, 10 e 9
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="bg-white border-2 border-[#111315] p-6 hc-card">
              <div className="inline-block px-2.5 py-1 bg-[#F5B700] text-[#111315] font-mono text-xs font-bold uppercase mb-3">
                ODS 11 · Cidades Sustentáveis
              </div>
              <h3 className="font-display text-lg font-bold text-[#111315]">
                Metas 11.2 e 11.7 — Transporte e Espaços Públicos Acessíveis
              </h3>
              <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
                Contribuímos para as metas 11.2 e 11.7 ao mapear o funcionamento real de elevadores
                em estações, rampas de travessia e calçadas públicas. Com isso, pessoas com
                deficiência e idosos planejam deslocamentos seguros, e falhas de manutenção deixam
                de ser invisíveis.
              </p>
            </article>

            <article className="bg-white border-2 border-[#111315] p-6 hc-card">
              <div className="inline-block px-2.5 py-1 bg-pink-600 text-white font-mono text-xs font-bold uppercase mb-3">
                ODS 10 · Redução das Desigualdades
              </div>
              <h3 className="font-display text-lg font-bold text-[#111315]">
                Meta 10.2 — Inclusão Social e Econômica
              </h3>
              <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
                A falta de informação sobre a acessibilidade de escolas, hospitais, bancos e
                comércios restringe o direito de ir e vir. Ao dar transparência pública sobre quais
                locais têm acessibilidade confirmada pela própria comunidade, reduzimos barreiras à
                participação social e econômica.
              </p>
            </article>

            <article className="bg-white border-2 border-[#111315] p-6 hc-card">
              <div className="inline-block px-2.5 py-1 bg-orange-600 text-white font-mono text-xs font-bold uppercase mb-3">
                ODS 9 · Inovação e Infraestrutura
              </div>
              <h3 className="font-display text-lg font-bold text-[#111315]">
                Meta 9.1 — Infraestrutura Confiável e Equitativa
              </h3>
              <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
                Transformamos relatos colaborativos em indicadores georreferenciados de inclinação,
                largura e concentração de barreiras urbanas. Essa base permite que o poder público
                direcione obras viárias para os trechos com maior índice de inacessibilidade.
              </p>
            </article>
          </div>
        </section>

        {/* Seção 3: Como garantimos a confiabilidade das informações */}
        <section className="bg-white border-2 border-[#111315] p-6 sm:p-8 hc-card">
          <h2 className="font-display text-2xl font-bold text-[#111315]">
            Regras de cálculo e validação dos relatos
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Para evitar informações desatualizadas ou avaliações isoladas distorcidas, o sistema
            aplica quatro critérios automáticos:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F4F4F0] border border-slate-300 hc-card">
              <h3 className="font-display font-bold text-[#111315] text-sm">
                1. Média Ponderada dos Últimos 30 Dias
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Como obras e problemas de manutenção mudam rapidamente, priorizamos os relatos
                registrados nos últimos 30 dias (Acessível = 100, Parcial = 50, Inacessível = 0).
              </p>
            </div>

            <div className="p-4 bg-[#F4F4F0] border border-slate-300 hc-card">
              <h3 className="font-display font-bold text-[#111315] text-sm">
                2. Confirmação por 3 ou Mais Pessoas Diferentes
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Um ponto urbano só recebe o selo <strong>CONFIRMADO</strong> quando acumula
                avaliações de pelo menos 3 cidadãos distintos no período.
              </p>
            </div>

            <div className="p-4 bg-[#F4F4F0] border border-slate-300 hc-card">
              <h3 className="font-display font-bold text-[#111315] text-sm">
                3. Limite de 1 Avaliação por Local por Dia
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Cada pessoa (identificada pelo seu e-mail) pode avaliar um mesmo local apenas uma
                vez por dia, bloqueando tentativas repetidas no servidor.
              </p>
            </div>

            <div className="p-4 bg-[#F4F4F0] border border-slate-300 hc-card">
              <h3 className="font-display font-bold text-[#111315] text-sm">
                4. Cálculo de Distância por Haversine
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                O filtro de proximidade calcula a distância esférica real em quilômetros entre o seu
                ponto de partida e cada local cadastrado.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/integrantes"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#0052CC] hover:underline hc-accent"
            >
              <span>Conhecer os integrantes do projeto</span>
              <IconArrowRight />
            </Link>
            <Link
              to="/locais"
              className="px-5 py-2.5 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider transition"
            >
              Consultar Locais no Mapa
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
