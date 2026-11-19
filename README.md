# Rotalivre — Mobilidade e Acessibilidade Urbana Colaborativa (Front-End)

> **Global Solution 2026/2 — CitizenTech · FIAP (1TDSPW)**  
> Disciplina: **Front-End Design Engineering**

O **Rotalivre** é um website colaborativo em que cidadãos (pessoas com deficiência, idosos, pessoas com mobilidade reduzida, pais com carrinho de bebê e colaboradores) consultam e relatam a acessibilidade de **calçadas, rampas, elevadores, estabelecimentos e obstáculos urbanos** antes de sair de casa.

---

## 1. Os 6 Critérios da Proposta CitizenTech (GS 2026/2)

| Critério | Resposta na Solução Rotalivre |
|---|---|
| **1. Quem é o cidadão** | Pessoas em cadeira de rodas, pessoas cegas ou com baixa visão, idosos, pessoas com mobilidade reduzida, pais com carrinho de bebê e cidadãos colaboradores (`tb_usuario`). |
| **2. Qual é o problema** | A falta de previsibilidade sobre barreiras urbanas no trajeto (segundo o Censo 2022 do IBGE, apenas 19,2% das vias urbanas brasileiras têm rampa para cadeirantes e 52,9% possuem obstáculos nas calçadas). |
| **3. Como funciona** | O cidadão consulta pontos mapeados (`tb_local_acessivel`) filtrando por tipo e raio geográfico (Fórmula de Haversine), verifica o Nível de Acessibilidade calculado pela média ponderada dos relatos dos últimos 30 dias (selo **CONFIRMADO** a partir de 3 usuários distintos) e envia novos relatos (`tb_relato`) identificando-se por e-mail (sem necessidade de login/senha). |
| **4. Quais tecnologias** | **Front-End:** React 18 + Vite + TypeScript + Tailwind CSS + Fetch API nativa (deploy na Vercel). **Back-End:** Java Spring Boot + JDBC + Docker no Render. **Banco:** Oracle Relacional. **IA:** Classificação + KMeans em Flask. **Python:** Planejador de trajeto por Haversine. |
| **5. Quem participa do ecossistema** | Cidadãos que consultam e relatam, prefeituras e secretarias municipais de mobilidade/obras (que priorizam reformas com base nos hotspots de barreiras) e estabelecimentos comerciais. |
| **6. Como o impacto é medido** | Total de locais mapeados, percentual de locais com nível **CONFIRMADO** (3+ cidadãos distintos em 30 dias), evolução da nota média de acessibilidade e redução de pontos classificados como `INACESSIVEL`. |

---

## 2. Alinhamento com os ODS da ONU

- **ODS 11 (Cidades e Comunidades Sustentáveis — Metas 11.2 e 11.7):** contribui diretamente ao mapear a acessibilidade física de calçadas, rampas e elevadores de transporte público, promovendo espaços públicos seguros, inclusivos e acessíveis para pessoas com deficiência e idosos.
- **ODS 10 (Redução das Desigualdades — Meta 10.2):** reduz a exclusão urbana e promove autonomia no deslocamento para estudo, saúde, trabalho e lazer por meio de informação colaborativa auditada por múltiplos cidadãos.
- **ODS 9 (Indústria, Inovação e Infraestrutura — Meta 9.1):** gera dados georreferenciados estruturados sobre inclinação (`vl_inclinacao_pct`), largura livre (`vl_largura_cm`) e barreiras para orientar investimentos em infraestrutura urbana resiliente e equitativa.

---

## 3. Tecnologias Utilizadas (Stack Obrigatória)

- **React 18** (`react`, `react-dom`)
- **Vite 5** (bundler e servidor de desenvolvimento)
- **TypeScript 5** (tipagem estrita das entidades, DTOs e respostas da API)
- **Tailwind CSS 3** (estilização responsiva e modo de Alto Contraste acessível)
- **React Router DOM 6** (`react-router-dom` para rotas estáticas e rotas parametrizadas)
- **Fetch API nativa (`window.fetch`)** centralizada em `src/services/` (conforme exigência estrita da rubrica — **sem Axios** e sem bibliotecas externas proibidas).

---

## 4. Estrutura de Pastas do Projeto

```text
rotalivre-front/
├── public/
├── src/
│   ├── components/            # Componentes próprios reaproveitados
│   │   ├── AccessibilityBadge.tsx
│   │   ├── AccessibilityBar.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LocalCard.tsx
│   │   ├── LocalFormModal.tsx
│   │   ├── PageHeader.tsx
│   │   ├── RadarMap.tsx       # Mapa/Radar espacial autoral em SVG + Haversine
│   │   └── StatusFeedback.tsx # Estados de Loading, Erro e Lista Vazia
│   ├── data/
│   │   └── integrantes.ts     # Dados centralizados da equipe e catálogos do banco
│   ├── pages/                 # Páginas institucionais e da solução
│   │   ├── Home.tsx           # /
│   │   ├── Integrantes.tsx    # /integrantes
│   │   ├── IntegranteDetalhe.tsx # /integrantes/:rm (rota com parâmetro)
│   │   ├── Sobre.tsx          # /sobre
│   │   ├── Faq.tsx            # /faq
│   │   ├── Contato.tsx        # /contato
│   │   ├── Locais.tsx         # /locais (GET, POST, filtros por tipo e raio Haversine)
│   │   ├── LocalDetalhe.tsx   # /locais/:id (rota com parâmetro, GET, PUT, DELETE)
│   │   ├── NovoRelato.tsx     # /relatos/novo (POST relato + identificação por e-mail)
│   │   └── NotFound.tsx       # Fallback 404
│   ├── services/              # Camada de integração HTTP exclusiva com Fetch API
│   │   ├── acessibilidadeCalc.ts # Fórmula de Haversine e Média Ponderada (30 dias)
│   │   ├── api.ts             # Cliente Fetch API nativo e sanitização de erros
│   │   ├── locaisService.ts   # GET, POST, PUT, DELETE em /locais
│   │   ├── normalizers.ts     # Normalizador de DTOs da API Java
│   │   ├── relatosService.ts  # GET e POST em /locais/{id}/relatos
│   │   └── usuariosService.ts # Resolução/criação de usuário por e-mail em /usuarios
│   ├── types/
│   │   └── index.ts           # Interfaces TypeScript espelhando banco Oracle e DTOs
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── integrantes.txt            # Identificação com RM, nome completo e turma
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                # Rewrites SPA para deploy na Vercel
└── vite.config.ts
```

---

## 5. Rotas da Aplicação

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Institucional | Home com proposta do Rotalivre, estatísticas reais do IBGE (Censo 2022) e os 6 critérios da GS |
| `/integrantes` | Institucional | Equipe responsável pelo projeto (rota estática) |
| `/integrantes/:rm` | Institucional | Perfil individual detalhado de um integrante (rota com parâmetro `:rm`) |
| `/sobre` | Institucional | Problema, ODS 11/10/9 (como contribui para as metas) e regras de negócio |
| `/faq` | Institucional | Perguntas frequentes interativas com filtro de busca |
| `/contato` | Institucional | Formulário de contato com validação em tempo real e no envio |
| `/locais` | Solução | Lista e Radar SVG de locais (`GET /locais`), filtro por tipo e raio (Haversine) e cadastro (`POST /locais`) |
| `/locais/:id` | Solução | Detalhe do local, nível de acessibilidade (30 dias), relatos (`GET /locais/{id}/relatos`), edição (`PUT`) e exclusão (`DELETE`) |
| `/relatos/novo` | Solução | Formulário de novo relato (`POST /locais/{id}/relatos`) identificando o cidadão por e-mail, com estados de loading, erro (`400`, `404`, `409 Conflict`) e sucesso |

---

## 6. Responsividade e Acessibilidade Web

- **Resoluções homologadas (sem barra de rolagem horizontal, cortes ou sobreposições):**
  - Mobile: `390x844`
  - Tablet: `768x1024`
  - Desktop: `1440x900`
- **Recursos de Acessibilidade do próprio site:**
  - Barra de Acessibilidade no topo com **Modo de Alto Contraste** (`high-contrast`), **Ajuste de Fonte (`A`, `A+`, `A++`)** e link de salto **Pular para o conteúdo principal** (`Skip-to-content`).
  - Navegação integral por teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`) com anel de foco visível (`:focus-visible`).
  - Atributos semânticos WAI-ARIA (`role="alert"`, `aria-live="polite"`, `aria-expanded`, `aria-invalid`, `alt` descritivo em imagens).

---

## 7. Integrantes do Grupo (1TDSPW)

| Nome Completo | RM | Turma | Papel / Frente Principal |
|---|---|---|---|
| Rodrigo Banharelli de Souza | 570539 | 1TDSPW | Front-End Design Engineering |
| Nycolas Melo Escobar | 573052 | 1TDSPW | Domain Driven Design Using Java |
| Gabriel Augusto | 573120 | 1TDSPW | Building Relational Database |
| Tayna Jimenes Silva | 569337 | 1TDSPW | Artificial Intelligence & Chatbot |
| Davi Trindade Ribeiro | 571336 | 1TDSPW | Computational Thinking Using Python & Software Engineering |

---

## 8. Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** 18+ e **npm**

### Passo a passo
1. Acesse a pasta do projeto:
   ```bash
   cd rotalivre-front
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure a variável de ambiente `VITE_API_URL` no arquivo `.env` apontando para a API Java no Render (ou `http://localhost:8080` para testes locais):
   ```env
   VITE_API_URL=https://rotalivre-gs.onrender.com
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Para gerar a build de produção e validar a tipagem TypeScript:
   ```bash
   npm run build
   ```

---

## 9. Links de Entrega

- **Repositório Público no GitHub:** `[INSERIR LINK DO GITHUB AQUI]`
- **Aplicação Publicada na Vercel:** `[INSERIR URL DA VERCEL AQUI]`
- **API Java Publicada no Render:** `https://rotalivre-gs.onrender.com`
- **Vídeo de Demonstração no YouTube (até 3 min):** `[INSERIR LINK DO YOUTUBE AQUI]`

---

## 10. Declaração de Uso de Inteligência Artificial Generativa

Conforme exigido pelas diretrizes da Global Solution 2026/2:
- **Ferramentas utilizadas:** Assistente de IA generativa para apoio na organização da estrutura de componentes, revisão de textos institucionais sobre as metas das ODS (11, 10 e 9), consulta aos dados públicos do Censo IBGE 2022 e validação de tipos TypeScript.
- **Revisão humana:** Todo o código-fonte, regras de negócio (cálculo de Haversine, média ponderada de 30 dias, validação de 3+ usuários distintos para status `CONFIRMADO` e tratamento de `409 Conflict`), estilização Tailwind CSS e integração via Fetch API foram integralmente revisados, testados e validados pelos integrantes do grupo.
