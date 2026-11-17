import { NovoUsuarioDTO, Usuario } from '../types';
import { apiFetch } from './api';
import { extrairListaDaResposta, normalizarUsuario } from './normalizers';

/**
 * Serviços HTTP (Fetch API) para a entidade Usuario (/usuarios)
 * Nomes dos campos no body JSON seguem estritamente os DTOs da API Java (Insomnia req_05 e req_08):
 * {
 *   "nome": "Maria Teste",
 *   "email": "maria.teste@exemplo.com",
 *   "perfilMobilidade": "IDOSO" | "CADEIRANTE"
 * }
 */
export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await apiFetch<unknown>('/usuarios', {
    method: 'GET',
  });
  const lista = extrairListaDaResposta(data);
  return lista.map((u) => normalizarUsuario(u));
}

export async function buscarUsuarioPorId(cdUsuario: number): Promise<Usuario> {
  const { data } = await apiFetch<unknown>(`/usuarios/${cdUsuario}`, {
    method: 'GET',
  });
  return normalizarUsuario(data);
}

export async function criarUsuario(dto: NovoUsuarioDTO): Promise<Usuario> {
  const payload = {
    nome: dto.nmUsuario.trim(),
    email: dto.dsEmail.trim().toLowerCase(),
    perfilMobilidade: dto.dsPerfilMobilidade.trim().toUpperCase() || 'CADEIRANTE',
  };

  const { data, location } = await apiFetch<unknown>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (data && typeof data === 'object') {
    const normalizado = normalizarUsuario(data);
    if (normalizado.cdUsuario > 0) {
      return normalizado;
    }
  }

  if (location) {
    const match = location.match(/\/(\d+)\s*$/);
    if (match) {
      const novoId = Number(match[1]);
      return {
        cdUsuario: novoId,
        nmUsuario: payload.nome,
        dsEmail: payload.email,
        dsPerfilMobilidade: payload.perfilMobilidade,
        dtCadastro: new Date().toISOString(),
      };
    }
  }

  return {
    cdUsuario: 0,
    nmUsuario: payload.nome,
    dsEmail: payload.email,
    dsPerfilMobilidade: payload.perfilMobilidade,
    dtCadastro: new Date().toISOString(),
  };
}

/**
 * Garante que o e-mail informado no relato exista na tabela de usuários da API Java
 * (evitando o erro 404 da req_24 quando um novo morador envia seu primeiro relato).
 * Caso o e-mail já exista (409 da req_06), segue normalmente.
 */
export async function resolverOuCriarUsuarioPorEmail(params: {
  dsEmail: string;
  nmUsuario?: string;
  dsPerfilMobilidade?: string;
}): Promise<Usuario | null> {
  const emailLimpo = params.dsEmail.trim().toLowerCase();
  const nomePadrao =
    params.nmUsuario && params.nmUsuario.trim().length >= 2
      ? params.nmUsuario.trim()
      : emailLimpo.split('@')[0] || 'Morador Rotalivre';
  const perfilPadrao =
    params.dsPerfilMobilidade && params.dsPerfilMobilidade.trim().length > 0
      ? params.dsPerfilMobilidade.trim().toUpperCase()
      : 'CADEIRANTE';

  try {
    const usuarios = await listarUsuarios();
    const existente = usuarios.find(
      (u) => u.dsEmail.trim().toLowerCase() === emailLimpo
    );
    if (existente) {
      return existente;
    }
  } catch {
    // Segue para tentativa de criação
  }

  try {
    return await criarUsuario({
      nmUsuario: nomePadrao,
      dsEmail: emailLimpo,
      dsPerfilMobilidade: perfilPadrao,
    });
  } catch {
    // Caso o perfil escolhido não passe em validação estrita de enum, tenta com CADEIRANTE
    try {
      return await criarUsuario({
        nmUsuario: nomePadrao,
        dsEmail: emailLimpo,
        dsPerfilMobilidade: 'CADEIRANTE',
      });
    } catch {
      return null;
    }
  }
}
