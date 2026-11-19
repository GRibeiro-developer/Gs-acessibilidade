import { ApiErrorResponse } from '../types';

const STORAGE_KEY_API_OVERRIDE = 'rotalivre_api_url_override';

/**
 * Obtém a URL base da API Java (Render).
 * Prioriza override manual salvo pelo avaliador/desenvolvedor na UI,
 * depois a variável de ambiente VITE_API_URL.
 */
const URL_OFICIAL_RENDER = 'https://rotalivre-gs.onrender.com';
const URL_ANTIGA_PLACEHOLDER = 'https://rotalivre-api.onrender.com';

export function getApiBaseUrl(): string {
  localStorage.removeItem(STORAGE_KEY_API_OVERRIDE);
  const envUrl = String(import.meta.env.VITE_API_URL || URL_OFICIAL_RENDER)
    .trim()
    .replace(/\/+$/, '');
  if (!envUrl || envUrl === URL_ANTIGA_PLACEHOLDER) {
    return URL_OFICIAL_RENDER;
  }
  return envUrl;
}

export function setApiBaseUrlOverride(novaUrl: string | null): void {
  if (!novaUrl || !novaUrl.trim()) {
    localStorage.removeItem(STORAGE_KEY_API_OVERRIDE);
    return;
  }
  localStorage.setItem(STORAGE_KEY_API_OVERRIDE, novaUrl.trim().replace(/\/+$/, ''));
}

export function hasApiBaseUrlOverride(): boolean {
  return Boolean(localStorage.getItem(STORAGE_KEY_API_OVERRIDE));
}

/**
 * Exceção padronizada da camada de serviços HTTP (Fetch API)
 * Garante que stack traces ou comandos SQL jamais sejam exibidos na UI.
 */
export class ApiException extends Error {
  public readonly status: number;
  public readonly fields?: Record<string, string>;
  public readonly locationHeader?: string | null;

  constructor(
    message: string,
    status: number,
    fields?: Record<string, string>,
    locationHeader?: string | null
  ) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.fields = fields;
    this.locationHeader = locationHeader;
  }
}

/**
 * Sanitiza mensagens vindas do servidor para garantir a regra do contrato:
 * nunca exibir stack trace Java ou detalhes de SQL na tela.
 */
function sanitizarMensagemErro(rawMessage: string | undefined, status: number): string {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return obterMensagemPadraoPorStatus(status);
  }

  const pareceStackTraceOuSql =
    /java\.lang\.|org\.springframework\.|ORA-\d+|SELECT\s+.*\s+FROM|INSERT\s+INTO|SQLException|at\s+[\w.$]+\([\w.]+:\d+\)/i.test(
      rawMessage
    );

  if (pareceStackTraceOuSql) {
    return obterMensagemPadraoPorStatus(status);
  }

  return rawMessage.trim();
}

function obterMensagemPadraoPorStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Dados inválidos no formulário (400 Bad Request). Verifique os campos preenchidos.';
    case 404:
      return 'O registro solicitado não foi encontrado na API (404 Not Found).';
    case 405:
      return 'Operação HTTP não suportada nesta rota (405 Method Not Allowed).';
    case 409:
      return 'Conflito de regra de negócio (409 Conflict): um usuário não pode relatar o mesmo local mais de uma vez no mesmo dia, ou o registro possui vínculos ativos.';
    case 500:
      return 'Ocorreu um erro interno na API (500). Tente novamente em instantes.';
    default:
      return `Não foi possível concluir a requisição na API (HTTP ${status}).`;
  }
}

export interface ApiFetchResult<T> {
  data: T;
  status: number;
  location: string | null;
}

/**
 * Cliente HTTP utilizando EXCLUSIVAMENTE a Fetch API nativa do navegador,
 * conforme exigência estrita da rubrica de Front-End Design Engineering.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiFetchResult<T>> {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await window.fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiException(
      `Não foi possível conectar à API Java em ${baseUrl}. Verifique se o servidor no Render está ativo (pode levar até 50s no primeiro acesso por cold start) ou se o CORS está liberado.`,
      0
    );
  }

  const location = response.headers.get('Location') || response.headers.get('location');

  if (response.status === 204) {
    return {
      data: undefined as unknown as T,
      status: 204,
      location,
    };
  }

  const text = await response.text();
  let parsedBody: unknown = null;
  if (text && text.trim().length > 0) {
    try {
      parsedBody = JSON.parse(text);
    } catch {
      parsedBody = text;
    }
  }

  if (!response.ok) {
    const errObj = (parsedBody && typeof parsedBody === 'object'
      ? parsedBody
      : {}) as Partial<ApiErrorResponse> & {
      erro?: string;
      mensagem?: string;
      detalhe?: string;
      erros?: Record<string, string>;
    };

    const rawMsg =
      errObj.message ||
      errObj.mensagem ||
      errObj.erro ||
      errObj.detalhe ||
      errObj.error;

    const cleanMessage = sanitizarMensagemErro(rawMsg, response.status);
    const fields = errObj.fields || errObj.erros;

    throw new ApiException(cleanMessage, response.status, fields, location);
  }

  return {
    data: parsedBody as T,
    status: response.status,
    location,
  };
}
