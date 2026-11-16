import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AccessibilityBar } from './components/AccessibilityBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Integrantes } from './pages/Integrantes';
import { IntegranteDetalhe } from './pages/IntegranteDetalhe';
import { Sobre } from './pages/Sobre';
import { Faq } from './pages/Faq';
import { Contato } from './pages/Contato';
import { Locais } from './pages/Locais';
import { LocalDetalhe } from './pages/LocalDetalhe';
import { NovoRelato } from './pages/NovoRelato';
import { NotFound } from './pages/NotFound';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F4F4F0] text-[#111315]">
        <AccessibilityBar />
        <Header />
        <main id="conteudo-principal" tabIndex={-1} className="flex-1 focus:outline-none">
          <Routes>
            {/* 5+ Rotas Institucionais + Rota Parametrizada de Integrante */}
            <Route path="/" element={<Home />} />
            <Route path="/integrantes" element={<Integrantes />} />
            <Route path="/integrantes/:rm" element={<IntegranteDetalhe />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contato" element={<Contato />} />

            {/* Rotas da Solução Rotalivre + Rota Parametrizada de Local */}
            <Route path="/locais" element={<Locais />} />
            <Route path="/locais/:id" element={<LocalDetalhe />} />
            <Route path="/relatos/novo" element={<NovoRelato />} />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
