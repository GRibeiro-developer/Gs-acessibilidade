import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

interface FaqItem {
  id: string;
  categoria: string;
  pergunta: string;
  resposta: string;
}

const FAQ_LISTA: FaqItem[] = [
  {
    id: 'faq-1',
    categoria: 'Participação',
    pergunta: 'Preciso criar senha ou fazer login para registrar um relato?',
    resposta:
      'Não. Para facilitar a colaboração de qualquer cidadão na rua, não exigimos cadastro com senha. Basta informar seu e-mail, nome e perfil de mobilidade no formulário de avaliação.',
  },
  {
    id: 'faq-2',
    categoria: 'Confiabilidade',
    pergunta: 'Quando um local recebe o selo "CONFIRMADO"?',
    resposta:
      'A condição de cada ponto (Acessível, Parcial ou Inacessível) é calculada pela média ponderada das avaliações feitas nos últimos 30 dias. O selo CONFIRMADO só é atribuído quando pelo menos 3 pessoas diferentes avaliam aquele local no período.',
  },
  {
    id: 'faq-3',
    categoria: 'Regras de Uso',
    pergunta: 'Por que não consegui enviar dois relatos seguidos para o mesmo local no mesmo dia?',
    resposta:
      'Para evitar distorções na nota de acessibilidade, o sistema permite no máximo 1 avaliação por pessoa (identificada pelo e-mail) para um mesmo local a cada dia. Caso tente repetir no mesmo dia, o servidor bloqueia o envio (HTTP 409).',
  },
  {
    id: 'faq-4',
    categoria: 'Geolocalização',
    pergunta: 'Como funciona o cálculo de distância e o filtro por raio?',
    resposta:
      'Usamos a Fórmula de Haversine para calcular a distância em linha esférica (em quilômetros) entre o seu ponto de referência (obtido pelo GPS do navegador ou escolhido na lista de referências) e a coordenada exata de cada ponto cadastrado.',
  },
  {
    id: 'faq-5',
    categoria: 'Normas Técnicas',
    pergunta: 'Quais medidas definem se uma rampa ou calçada é adequada?',
    resposta:
      'Seguimos as referências da norma brasileira ABNT NBR 9050: rampas devem ter inclinação longitudinal máxima de 8,33% e calçadas devem preservar uma faixa livre de passagem recomendada de no mínimo 120 cm.',
  },
  {
    id: 'faq-6',
    categoria: 'Histórico',
    pergunta: 'Um local que já tem relatos de cidadãos pode ser apagado?',
    resposta:
      'Não. Para preservar o histórico de avaliações da comunidade, a API não permite excluir locais que já possuem relatos vinculados. Se um ponto for desativado ou reformado, basta editar o cadastro e alterar sua situação para Inativo.',
  },
];

export const Faq: React.FC = () => {
  const [abertaId, setAbertaId] = useState<string | null>('faq-1');
  const [busca, setBusca] = useState<string>('');

  const itensFiltrados = FAQ_LISTA.filter((item) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    return (
      item.pergunta.toLowerCase().includes(termo) ||
      item.resposta.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo)
    );
  });

  return (
    <div>
      <PageHeader
        badge="Central de Ajuda"
        title="Dúvidas Frequentes"
        subtitle="Entenda como funcionam os relatos colaborativos, o cálculo da nota de acessibilidade e os critérios técnicos adotados pelo Rotalivre."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Dúvidas' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="bg-white border-2 border-[#111315] p-4 sm:p-5 hc-card">
          <label
            htmlFor="busca-faq"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
          >
            Filtrar perguntas por palavra-chave
          </label>
          <input
            id="busca-faq"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Ex.: e-mail, confirmado, distância, rampa..."
            className="w-full px-4 py-2.5 border border-slate-400 text-sm"
          />
        </div>

        <div className="space-y-3">
          {itensFiltrados.map((item) => {
            const estaAberta = abertaId === item.id;
            return (
              <article
                key={item.id}
                className="bg-white border-2 border-[#111315] overflow-hidden hc-card"
              >
                <h2>
                  <button
                    type="button"
                    aria-expanded={estaAberta}
                    aria-controls={`painel-${item.id}`}
                    onClick={() => setAbertaId(estaAberta ? null : item.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <div>
                      <span className="inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-[#0052CC] mb-1 hc-accent">
                        {item.categoria}
                      </span>
                      <span className="block font-display text-sm sm:text-base font-bold text-[#111315]">
                        {item.pergunta}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 bg-[#111315] text-white font-mono flex items-center justify-center font-bold shrink-0"
                    >
                      {estaAberta ? '−' : '+'}
                    </span>
                  </button>
                </h2>

                {estaAberta && (
                  <div
                    id={`painel-${item.id}`}
                    className="px-5 pb-5 pt-2 text-sm text-slate-700 leading-relaxed border-t border-slate-200"
                  >
                    {item.resposta}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="bg-white border-2 border-[#111315] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hc-card">
          <div>
            <h2 className="font-display text-base font-bold text-[#111315]">
              Não encontrou o que procurava?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Envie uma mensagem para a equipe ou registre diretamente a avaliação de um local.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              to="/contato"
              className="px-4 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold uppercase tracking-wider transition"
            >
              Entrar em Contato
            </Link>
            <Link
              to="/relatos/novo"
              className="px-4 py-2 bg-[#F5B700] hover:bg-amber-400 text-[#111315] border border-[#111315] text-xs font-extrabold uppercase transition"
            >
              Avaliar Local
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
