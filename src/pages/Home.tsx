import React from 'react';
import { Link } from 'react-router-dom';
import { TIPOS_LOCAL_CATALOGO } from '../data/integrantes';
import { formatarLabelTipoLocal } from '../services/acessibilidadeCalc';
import {
  IconArrowRight,
  IconCheck,
  IconCompass,
  IconPlus,
  IconShieldCheck,
} from '../components/Icons';

export const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-8">
      {/* Seção 1: Boas-vindas e Ação Principal (H1) */}
      <section className="bg-white border-b border-slate-300 hc-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-base font-bold text-[#0047B3] hc-accent">
                Mobilidade nas ruas de São Paulo
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Veja se a calçada, a rampa ou o elevador têm passagem livre antes de sair de casa.
              </h1>

              <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
                O <strong>Rotalivre</strong> é um site gratuito feito por moradores. Aqui você
                consulta como está o seu caminho hoje e avisa outras pessoas quando encontra um
                buraco, um degrau sem rampa ou um elevador parado.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/locais"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg bg-[#0047B3] hover:bg-blue-800 text-white text-base font-bold"
                >
                  <IconCompass className="w-5 h-5" />
                  <span>Consultar locais no mapa</span>
                </Link>
                <Link
                  to="/relatos/novo"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 text-base font-bold hc-card"
                >
                  <IconPlus className="w-5 h-5" />
                  <span>Avaliar uma calçada ou local</span>
                </Link>
              </div>

              <ul className="pt-4 space-y-2 text-base text-slate-800">
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <IconCheck />
                  </span>
                  <span>Você não precisa criar senha para participar.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <IconCheck />
                  </span>
                  <span>Mostramos avaliações feitas nos últimos 30 dias.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <IconCheck />
                  </span>
                  <span>
                    Um local ganha o selo <strong>Confirmado</strong> quando 3 pessoas diferentes
                    avaliam o ponto.
                  </span>
                </li>
              </ul>
            </div>

            {/* Imagem real com Texto Alternativo (Alt Text) detalhado e legenda */}
            <div className="lg:col-span-5">
              <figure className="bg-slate-100 border border-slate-300 rounded-xl overflow-hidden hc-card">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=80"
                  alt="Pessoa em cadeira de rodas atravessando uma faixa de pedestres urbana em direção a uma rampa de calçada rebaixada com piso tátil."
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <figcaption className="p-4 text-sm text-slate-700 bg-white border-t border-slate-300 hc-card">
                  Saber onde há rampas, piso tátil e elevadores funcionando evita que você precise
                  voltar no meio do caminho.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Como funciona em 3 passos simples (H2 + H3) */}
      <section
        aria-labelledby="titulo-como-funciona"
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 hc-card">
          <h2
            id="titulo-como-funciona"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900"
          >
            Como usar o Rotalivre em 3 passos
          </h2>
          <p className="mt-2 text-base text-slate-700">
            Qualquer pessoa pode consultar um endereço ou enviar uma avaliação em menos de 1
            minuto.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <span className="inline-block px-3 py-1 rounded-md bg-[#0047B3] text-white text-sm font-bold mb-3">
                Passo 1
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Escolha o endereço ou a região
              </h3>
              <p className="mt-2 text-base text-slate-700 leading-relaxed">
                Busque pelo nome da rua ou use sua localização para ver os pontos mais próximos de
                você em quilômetros.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <span className="inline-block px-3 py-1 rounded-md bg-[#0047B3] text-white text-sm font-bold mb-3">
                Passo 2
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Veja se o caminho está livre
              </h3>
              <p className="mt-2 text-base text-slate-700 leading-relaxed">
                Cada local mostra se está <strong>Acessível</strong>, <strong>Parcial</strong> ou{' '}
                <strong>Inacessível</strong>, além da largura da calçada e da inclinação da rampa.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <span className="inline-block px-3 py-1 rounded-md bg-[#0047B3] text-white text-sm font-bold mb-3">
                Passo 3
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Conte como estava o local hoje
              </h3>
              <p className="mt-2 text-base text-slate-700 leading-relaxed">
                Passou por uma calçada quebrada ou rampa boa? Digite seu e-mail e envie seu relato
                para ajudar a próxima pessoa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 3: O que você quer consultar agora? (H2 + H3) */}
      <section
        aria-labelledby="titulo-categorias"
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="mb-6">
          <h2
            id="titulo-categorias"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900"
          >
            O que você quer consultar agora?
          </h2>
          <p className="mt-2 text-base text-slate-700">
            Selecione um tipo de local para abrir a lista filtrada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIPOS_LOCAL_CATALOGO.map((tipo) => {
            const nomeAmigavel = formatarLabelTipoLocal(tipo.nmTipoLocal);
            return (
              <article
                key={tipo.cdTipoLocal}
                className="bg-white border border-slate-300 rounded-xl p-6 flex flex-col justify-between hc-card"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{nomeAmigavel}</h3>
                  <p className="mt-2 text-base text-slate-700 leading-relaxed">
                    {tipo.dsTipoLocal}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <Link
                    to={`/locais?tipo=${tipo.nmTipoLocal}`}
                    className="inline-flex items-center gap-2 text-base font-bold text-[#0047B3] hover:underline hc-accent"
                  >
                    <span>Ver locais do tipo {nomeAmigavel}</span>
                    <IconArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Seção 4: Dados reais sobre as calçadas no Brasil (IBGE) */}
      <section
        aria-labelledby="titulo-evidencias"
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 hc-card">
          <h2
            id="titulo-evidencias"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900"
          >
            A realidade das calçadas no Brasil segundo o IBGE
          </h2>
          <p className="mt-2 text-base text-slate-700">
            Os números oficiais mostram por que é tão importante avisar onde estão as barreiras nas
            ruas:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-[#0047B3] hc-card">
              <p className="text-3xl font-extrabold text-slate-900">18,6 milhões</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Pessoas com deficiência no país
              </h3>
              <p className="mt-1 text-base text-slate-700">
                Representam 8,9% da população brasileira com 2 anos ou mais de idade.
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Fonte: IBGE — Pesquisa Nacional por Amostra de Domicílios (julho de 2023).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-amber-600 hc-card">
              <p className="text-3xl font-extrabold text-slate-900">Apenas 19,2%</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Das ruas têm rampa na calçada
              </h3>
              <p className="mt-1 text-base text-slate-700">
                Em cada 5 moradores das cidades brasileiras, 4 vivem em ruas sem rampa para cadeira
                de rodas.
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Fonte: IBGE — Censo Demográfico 2022: Entorno dos Domicílios (abril de 2024).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-red-700 hc-card">
              <p className="text-3xl font-extrabold text-slate-900">52,9%</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Das calçadas têm buracos ou obstáculos
              </h3>
              <p className="mt-1 text-base text-slate-700">
                Mais da metade dos moradores enfrenta degraus, buracos ou postes bloqueando a
                passagem na própria rua.
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Fonte: IBGE — Censo Demográfico 2022: Entorno dos Domicílios (abril de 2024).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 5: Perguntas essenciais sobre o projeto (Os 6 critérios da GS em linguagem simples) */}
      <section
        aria-labelledby="titulo-resumo-projeto"
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 hc-card">
          <div className="flex items-center gap-2 text-[#0047B3] font-bold text-base mb-1 hc-accent">
            <IconShieldCheck className="w-5 h-5" />
            <span>Transparência do projeto</span>
          </div>
          <h2
            id="titulo-resumo-projeto"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900"
          >
            Para quem fazemos o Rotalivre e como medimos os resultados
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <h3 className="text-lg font-bold text-slate-900">
                1. Quem usa o site
              </h3>
              <p className="mt-1.5 text-base text-slate-700">
                Pessoas em cadeira de rodas, pessoas cegas ou com baixa visão, idosos, pessoas com
                perna engessada ou muletas, pais com carrinho de bebê e voluntários.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <h3 className="text-lg font-bold text-slate-900">
                2. Qual problema resolvemos
              </h3>
              <p className="mt-1.5 text-base text-slate-700">
                Acabamos com a dúvida de sair de casa sem saber se a calçada tem rampa, se a
                passagem é larga o suficiente ou se o elevador da estação está funcionando.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <h3 className="text-lg font-bold text-slate-900">
                3. Como garantimos informação verdadeira
              </h3>
              <p className="mt-1.5 text-base text-slate-700">
                Calculamos a nota com base nos relatos dos últimos 30 dias. Cada pessoa só pode
                avaliar o mesmo local 1 vez por dia, e o ponto precisa de 3 pessoas diferentes para
                ser confirmado.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <h3 className="text-lg font-bold text-slate-900">
                4. Quem faz parte desta rede
              </h3>
              <p className="mt-1.5 text-base text-slate-700">
                Moradores que avaliam as ruas, prefeituras que usam o mapa de problemas para
                consertar calçadas, e comércios que adaptam suas entradas.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <h3 className="text-lg font-bold text-slate-900">
                5. Tecnologias que sustentam o sistema
              </h3>
              <p className="mt-1.5 text-base text-slate-700">
                Site rápido e acessível em React e TypeScript conectado a um banco de dados Oracle
                por meio de uma API Java, com apoio de inteligência artificial e Python.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 hc-card">
              <h3 className="text-lg font-bold text-slate-900">
                6. Como acompanhamos a melhoria nas ruas
              </h3>
              <p className="mt-1.5 text-base text-slate-700">
                Medimos o número de locais cadastrados, a quantidade de pontos confirmados por 3 ou
                mais pessoas e quantos trechos antes bloqueados passaram a ficar acessíveis.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-base font-bold text-[#0047B3] hover:underline hc-accent"
            >
              <span>Ler mais sobre como o projeto funciona</span>
              <IconArrowRight />
            </Link>
            <Link
              to="/locais"
              className="px-5 py-3 rounded-lg bg-[#0047B3] hover:bg-blue-800 text-white text-base font-bold"
            >
              Consultar locais no mapa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
