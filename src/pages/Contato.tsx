import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { IconCheck } from '../components/Icons';

interface ErrosContato {
  nome?: string;
  email?: string;
  perfil?: string;
  assunto?: string;
  mensagem?: string;
  aceiteLgpd?: string;
}

export const Contato: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [aceiteLgpd, setAceiteLgpd] = useState(false);

  const [erros, setErros] = useState<ErrosContato>({});
  const [enviando, setEnviando] = useState(false);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);

  const validarCampos = (): boolean => {
    const novosErros: ErrosContato = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome.trim() || nome.trim().length < 3) {
      novosErros.nome = 'Informe seu nome completo (mínimo de 3 caracteres).';
    }

    if (!email.trim() || !emailRegex.test(email.trim())) {
      novosErros.email = 'Informe um endereço de e-mail válido (ex.: nome@dominio.com).';
    }

    if (!perfil) {
      novosErros.perfil = 'Selecione seu perfil ou vínculo.';
    }

    if (!assunto.trim() || assunto.trim().length < 5) {
      novosErros.assunto = 'Informe o assunto da mensagem (mínimo de 5 caracteres).';
    }

    if (!mensagem.trim() || mensagem.trim().length < 15) {
      novosErros.mensagem = 'Escreva uma mensagem com pelo menos 15 caracteres.';
    }

    if (!aceiteLgpd) {
      novosErros.aceiteLgpd =
        'É necessário concordar com os termos de privacidade antes de enviar.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviadoComSucesso(false);

    if (!validarCampos()) {
      return;
    }

    setEnviando(true);
    window.setTimeout(() => {
      setEnviando(false);
      setEnviadoComSucesso(true);
      setNome('');
      setEmail('');
      setPerfil('');
      setAssunto('');
      setMensagem('');
      setAceiteLgpd(false);
      setErros({});
    }, 450);
  };

  return (
    <div>
      <PageHeader
        badge="Atendimento e Parcerias"
        title="Fale com a equipe do Rotalivre"
        subtitle="Envie sugestões de pontos que precisam ser mapeados, dúvidas sobre uso da plataforma ou propostas de integração com órgãos públicos."
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Contato' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border-2 border-[#111315] p-6 hc-card">
              <h2 className="font-display text-lg font-bold text-[#111315]">
                Informações de Contato
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Respondemos solicitações de cidadãos, pesquisadores e gestores municipais pelo
                e-mail informado no formulário.
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="p-3.5 bg-[#F4F4F0] border border-slate-300 hc-card">
                  <dt className="font-mono text-[11px] font-bold uppercase text-slate-500">
                    E-mail direto
                  </dt>
                  <dd className="font-mono font-bold text-[#111315] mt-0.5">
                    contato@rotalivre.org.br
                  </dd>
                </div>
                <div className="p-3.5 bg-[#F4F4F0] border border-slate-300 hc-card">
                  <dt className="font-mono text-[11px] font-bold uppercase text-slate-500">
                    Desenvolvimento
                  </dt>
                  <dd className="font-bold text-[#111315] mt-0.5">
                    FIAP · Turma 1TDSPW (Global Solution 2026)
                  </dd>
                </div>
                <div className="p-3.5 bg-[#F4F4F0] border border-slate-300 hc-card">
                  <dt className="font-mono text-[11px] font-bold uppercase text-slate-500">
                    Privacidade e Dados (LGPD)
                  </dt>
                  <dd className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    Não armazenamos senhas nem fotos com rostos de pedestres. Os dados deste
                    formulário destinam-se exclusivamente ao retorno do seu contato.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7">
            <section
              aria-labelledby="titulo-form-contato"
              className="bg-white border-2 border-[#111315] p-6 sm:p-8 hc-card"
            >
              <h2 id="titulo-form-contato" className="font-display text-xl font-bold text-[#111315]">
                Envie sua mensagem
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Campos marcados com asterisco (*) são de preenchimento obrigatório.
              </p>

              {enviadoComSucesso && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-5 p-4 bg-emerald-50 border-2 border-emerald-700 text-emerald-950 hc-card"
                >
                  <p className="font-bold text-sm inline-flex items-center gap-1.5">
                    <IconCheck />
                    <span>Mensagem recebida com sucesso.</span>
                  </p>
                  <p className="text-xs mt-1">
                    Obrigado por colaborar com o Rotalivre. Retornaremos em breve pelo e-mail
                    informado.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="contato-nome"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Nome completo *
                  </label>
                  <input
                    id="contato-nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (erros.nome) setErros({ ...erros, nome: undefined });
                    }}
                    aria-invalid={Boolean(erros.nome)}
                    aria-describedby={erros.nome ? 'erro-contato-nome' : undefined}
                    placeholder="Seu nome completo"
                    className={`w-full px-3.5 py-2.5 border text-sm ${
                      erros.nome ? 'border-red-600 bg-red-50/40' : 'border-slate-400'
                    }`}
                  />
                  {erros.nome && (
                    <p
                      id="erro-contato-nome"
                      role="alert"
                      className="mt-1 text-xs font-bold text-red-700"
                    >
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contato-email"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      E-mail *
                    </label>
                    <input
                      id="contato-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (erros.email) setErros({ ...erros, email: undefined });
                      }}
                      aria-invalid={Boolean(erros.email)}
                      aria-describedby={erros.email ? 'erro-contato-email' : undefined}
                      placeholder="voce@exemplo.com"
                      className={`w-full px-3.5 py-2.5 border text-sm ${
                        erros.email ? 'border-red-600 bg-red-50/40' : 'border-slate-400'
                      }`}
                    />
                    {erros.email && (
                      <p
                        id="erro-contato-email"
                        role="alert"
                        className="mt-1 text-xs font-bold text-red-700"
                      >
                        {erros.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contato-perfil"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Seu perfil *
                    </label>
                    <select
                      id="contato-perfil"
                      required
                      value={perfil}
                      onChange={(e) => {
                        setPerfil(e.target.value);
                        if (erros.perfil) setErros({ ...erros, perfil: undefined });
                      }}
                      aria-invalid={Boolean(erros.perfil)}
                      aria-describedby={erros.perfil ? 'erro-contato-perfil' : undefined}
                      className={`w-full px-3.5 py-2.5 border text-sm bg-white ${
                        erros.perfil ? 'border-red-600 bg-red-50/40' : 'border-slate-400'
                      }`}
                    >
                      <option value="">Selecione...</option>
                      <option value="CADEIRANTE">Pessoa em cadeira de rodas</option>
                      <option value="BAIXA_VISAO">Pessoa cega ou com baixa visão</option>
                      <option value="IDOSO_MOBILIDADE">Idoso / Mobilidade reduzida</option>
                      <option value="COLABORADOR">Cidadão colaborador</option>
                      <option value="GESTOR_PUBLICO">Gestor público / Prefeitura</option>
                      <option value="ESTABELECIMENTO">Representante de estabelecimento</option>
                    </select>
                    {erros.perfil && (
                      <p
                        id="erro-contato-perfil"
                        role="alert"
                        className="mt-1 text-xs font-bold text-red-700"
                      >
                        {erros.perfil}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contato-assunto"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Assunto *
                  </label>
                  <input
                    id="contato-assunto"
                    type="text"
                    required
                    value={assunto}
                    onChange={(e) => {
                      setAssunto(e.target.value);
                      if (erros.assunto) setErros({ ...erros, assunto: undefined });
                    }}
                    aria-invalid={Boolean(erros.assunto)}
                    aria-describedby={erros.assunto ? 'erro-contato-assunto' : undefined}
                    placeholder="Ex.: Sugestão de avaliação em estação de metrô"
                    className={`w-full px-3.5 py-2.5 border text-sm ${
                      erros.assunto ? 'border-red-600 bg-red-50/40' : 'border-slate-400'
                    }`}
                  />
                  {erros.assunto && (
                    <p
                      id="erro-contato-assunto"
                      role="alert"
                      className="mt-1 text-xs font-bold text-red-700"
                    >
                      {erros.assunto}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="contato-mensagem"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Mensagem *
                    </label>
                    <span className="font-mono text-[11px] text-slate-500">
                      {mensagem.trim().length} caracteres (mín. 15)
                    </span>
                  </div>
                  <textarea
                    id="contato-mensagem"
                    rows={4}
                    required
                    value={mensagem}
                    onChange={(e) => {
                      setMensagem(e.target.value);
                      if (erros.mensagem) setErros({ ...erros, mensagem: undefined });
                    }}
                    aria-invalid={Boolean(erros.mensagem)}
                    aria-describedby={erros.mensagem ? 'erro-contato-mensagem' : undefined}
                    placeholder="Escreva sua dúvida, sugestão ou relato..."
                    className={`w-full px-3.5 py-2.5 border text-sm ${
                      erros.mensagem ? 'border-red-600 bg-red-50/40' : 'border-slate-400'
                    }`}
                  />
                  {erros.mensagem && (
                    <p
                      id="erro-contato-mensagem"
                      role="alert"
                      className="mt-1 text-xs font-bold text-red-700"
                    >
                      {erros.mensagem}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aceiteLgpd}
                      onChange={(e) => {
                        setAceiteLgpd(e.target.checked);
                        if (erros.aceiteLgpd) setErros({ ...erros, aceiteLgpd: undefined });
                      }}
                      aria-invalid={Boolean(erros.aceiteLgpd)}
                      className="mt-1 w-4 h-4 border-slate-400 accent-[#0052CC]"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed">
                      Autorizo o uso dos dados informados exclusivamente para resposta a este
                      contato, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018). *
                    </span>
                  </label>
                  {erros.aceiteLgpd && (
                    <p role="alert" className="mt-1 text-xs font-bold text-red-700">
                      {erros.aceiteLgpd}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider border-2 border-[#111315] shadow-[2px_2px_0px_#111315] transition"
                  >
                    {enviando ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
