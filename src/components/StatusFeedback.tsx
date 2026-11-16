import React from 'react';
import { getApiBaseUrl } from '../services/api';
import { IconAlert, IconRefresh } from './Icons';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Buscando as informações atualizadas...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="bg-white border border-slate-300 rounded-xl p-8 text-center hc-card"
    >
      <p className="text-lg font-bold text-slate-900">{message}</p>
      <p className="mt-2 text-base text-slate-700 max-w-xl mx-auto">
        Por favor, aguarde alguns segundos enquanto carregamos os locais cadastrados no servidor.
      </p>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  status?: number;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Não conseguimos conectar com o servidor agora',
  message,
  status,
  onRetry,
}) => {
  const apiUrl = getApiBaseUrl();

  return (
    <div
      role="alert"
      className="bg-white border-2 border-red-700 rounded-xl p-6 sm:p-8 text-slate-900 hc-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-red-700 text-white flex items-center justify-center shrink-0">
          <IconAlert className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {status !== undefined && status > 0 && (
              <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-950 text-sm font-bold border border-red-300">
                Código {status}
              </span>
            )}
          </div>
          <p className="mt-2 text-base text-slate-800 leading-relaxed">{message}</p>
          <p className="mt-2 text-sm text-slate-600">
            Endereço consultado: <code className="px-1.5 py-0.5 bg-slate-100 rounded">{apiUrl}</code>.
            Você pode mudar esse endereço clicando no botão <strong>Trocar endereço da API</strong>{' '}
            no topo da página.
          </p>

          {onRetry && (
            <div className="mt-5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0047B3] hover:bg-blue-800 text-white text-base font-bold"
              >
                <IconRefresh />
                <span>Tentar carregar novamente</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="bg-white border border-slate-300 rounded-xl p-8 text-center hc-card">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-base text-slate-700 max-w-lg mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
};
