import { Integrante, RecursoAcessibilidade, TipoLocal } from '../types';

export const INTEGRANTES_GRUPO: Integrante[] = [
  {
    rm: '570539',
    nome: 'Rodrigo Banharelli de Souza',
    turma: '1TDS',
    papel: 'Front-End Design Engineering & UX Acessível',
    frentePrincipal: 'Front-End (React + Vite + TypeScript + Tailwind + Fetch API)',
    frentesApoio: ['Software Engineering & Business Model', 'Domain Driven Design Using Java'],
    bio: 'Responsável pela arquitetura do Front-End em React + TypeScript + Tailwind CSS, integração via Fetch API nativa com a API Java no Render, acessibilidade WCAG (teclado, contraste e semântica) e responsividade em mobile, tablet e desktop.',
    habilidades: ['React', 'TypeScript', 'Tailwind CSS', 'Fetch API', 'Acessibilidade WCAG', 'UX Writing'],
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    fotoUrl: 'https://ui-avatars.com/api/?name=Rodrigo+Banharelli&background=1d4ed8&color=fff&size=256&bold=true',
  },
  {
    rm: '573052',
    nome: 'Nycolas Melo Escobar',
    turma: '1TDS',
    papel: 'Back-End Java & Arquitetura de API REST',
    frentePrincipal: 'Domain Driven Design Using Java (Spring Boot + JDBC + Docker + Render)',
    frentesApoio: ['Building Relational Database', 'Front-End Design Engineering'],
    bio: 'Responsável pelo desenvolvimento da API REST em Java com Spring Boot, DAOs JDBC com PreparedStatement, DTOs com Bean Validation, regras de negócio (bloqueio de relato duplicado no mesmo dia, média ponderada de 30 dias e Haversine) e deploy via Docker no Render.',
    habilidades: ['Java', 'Spring Boot', 'JDBC', 'Docker', 'REST API', 'ModelMapper'],
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    fotoUrl: 'https://ui-avatars.com/api/?name=Nycolas+Escobar&background=047857&color=fff&size=256&bold=true',
  },
  {
    rm: '573120',
    nome: 'Gabriel Augusto',
    turma: '1TDS',
    papel: 'Modelagem de Dados & Banco Oracle',
    frentePrincipal: 'Building Relational Database (Oracle Data Modeler & SQL)',
    frentesApoio: ['Artificial Intelligence & Chatbot', 'Computational Thinking Using Python'],
    bio: 'Responsável pela modelagem conceitual, lógica e relacional no Oracle Data Modeler, criação das 6 tabelas do contrato (tb_usuario, tb_tipo_local, tb_local_acessivel, tb_relato, tb_recurso_acessibilidade e tb_local_recurso), carga de 60 registros e 10 consultas analíticas.',
    habilidades: ['Oracle SQL', 'Data Modeler', 'Modelagem Relacional', 'Integridade Referencial', 'Consultas Analíticas'],
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    fotoUrl: 'https://ui-avatars.com/api/?name=Gabriel+Augusto&background=b45309&color=fff&size=256&bold=true',
  },
  {
    rm: '569337',
    nome: 'Tayna Jimenes Silva',
    turma: '1TDS',
    papel: 'Inteligência Artificial & Ciência de Dados',
    frentePrincipal: 'Artificial Intelligence & Chatbot (Classificação, KMeans & API Flask)',
    frentesApoio: ['Computational Thinking Using Python', 'Building Relational Database'],
    bio: 'Responsável pelo pipeline de Machine Learning: análise exploratória (EDA), modelo de classificação da situação do local (ACESSIVEL, PARCIAL, INACESSIVEL), modelo de agrupamento KMeans de hotspots de barreiras urbanas e disponibilização em API Flask.',
    habilidades: ['Python', 'Scikit-Learn', 'Pandas', 'KMeans', 'Flask REST API', 'Jupyter Notebook'],
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    fotoUrl: 'https://ui-avatars.com/api/?name=Tayna+Jimenes&background=6d28d9&color=fff&size=256&bold=true',
  },
  {
    rm: '571336',
    nome: 'Davi Trindade Ribeiro',
    turma: '1TDS',
    papel: 'Algoritmos em Python & Engenharia de Software',
    frentePrincipal: 'Computational Thinking Using Python & Software Engineering and Business Model',
    frentesApoio: ['Front-End Design Engineering', 'Artificial Intelligence & Chatbot'],
    bio: 'Responsável pelo planejador de trajeto acessível em Python (cálculo de distância por Haversine e ranking de locais críticos) e pela documentação de negócio (BMC, benchmark, backlog ágil, casos de uso, diagramas de atividades, precificação, ROI e SLA).',
    habilidades: ['Python Estruturado', 'Haversine', 'Engenharia de Requisitos', 'BMC', 'UX & Nielsen', 'ROI & SLA'],
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    fotoUrl: 'https://ui-avatars.com/api/?name=Davi+Trindade&background=be123c&color=fff&size=256&bold=true',
  },
];

//Catalogo Local
export const TIPOS_LOCAL_CATALOGO: TipoLocal[] = [
  {
    cdTipoLocal: 1,
    nmTipoLocal: 'CALCADA',
    dsTipoLocal: 'Trecho de calçada, passeio público ou travessia de pedestres',
  },
  {
    cdTipoLocal: 2,
    nmTipoLocal: 'RAMPA',
    dsTipoLocal: 'Rampa de acesso em guia rebaixada, passarela ou entrada de edifício',
  },
  {
    cdTipoLocal: 3,
    nmTipoLocal: 'ELEVADOR',
    dsTipoLocal: 'Elevador ou plataforma elevatória em estação de transporte ou prédio público',
  },
  {
    cdTipoLocal: 4,
    nmTipoLocal: 'ESTABELECIMENTO',
    dsTipoLocal: 'Comércio, serviço público, hospital, instituição de ensino ou lazer',
  },
  {
    cdTipoLocal: 5,
    nmTipoLocal: 'OBSTACULO',
    dsTipoLocal: 'Barreira urbana crítica: buraco, degrau sem rampa, poste estreitando calçada ou obra sem desvio',
  },
];

//Catalogo acessibilidade lugares
export const RECURSOS_ACESSIBILIDADE_CATALOGO: RecursoAcessibilidade[] = [
  { cdRecurso: 1, nmRecurso: 'Rampa de acesso', dsRecurso: 'Rampa com inclinação adequada conforme NBR 9050' },
  { cdRecurso: 2, nmRecurso: 'Piso tátil', dsRecurso: 'Piso tátil direcional e de alerta para baixa visão e pessoas cegas' },
  { cdRecurso: 3, nmRecurso: 'Banheiro adaptado', dsRecurso: 'Sanitário acessível com barras de apoio e área de giro' },
  { cdRecurso: 4, nmRecurso: 'Vaga PcD', dsRecurso: 'Vaga de estacionamento reservada e sinalizada próxima ao acesso' },
  { cdRecurso: 5, nmRecurso: 'Elevador acessível', dsRecurso: 'Elevador operante com botoeira em Braille e aviso sonoro' },
  { cdRecurso: 6, nmRecurso: 'Corrimão duplo', dsRecurso: 'Corrimão contínuo em duas alturas com prolongamento nas extremidades' },
  { cdRecurso: 7, nmRecurso: 'Semáforo sonoro', dsRecurso: 'Travessia de pedestres equipada com sinalização sonora e tempo ampliado' },
  { cdRecurso: 8, nmRecurso: 'Entrada larga (>80cm)', dsRecurso: 'Vão livre de passagem superior a 80 cm sem degraus' },
];

//Ponto de referencia
export const PONTOS_REFERENCIA_SP = [
  { nome: 'FIAP Paulista (Av. Paulista, 1106)', lat: -23.5641, lon: -46.6524 },
  { nome: 'FIAP Aclimação (Av. Lins de Vasconcelos, 1222)', lat: -23.5738, lon: -46.6232 },
  { nome: 'Estação Sé / Marco Zero SP', lat: -23.5505, lon: -46.6333 },
  { nome: 'Parque Ibirapuera (Portão 3)', lat: -23.5874, lon: -46.6576 },
  { nome: 'Terminal Pinheiros', lat: -23.5672, lon: -46.7019 },
];
