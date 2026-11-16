import { NovoUsuarioDTO, Usuario } from '../types';
import { apiFetch } from './api';
import { extrairListaDaResposta, normalizarUsuario } from './normalizers';

/**
 * Serviços HTTP (Fetch API) para a entidade Usuario (/usuarios)
 * Conforme Contrato da Solução: "Sem login na entrega: o formulário de relato
 * identifica o usuário por e-mail (por isso a tabela não guarda senha)."
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
    nmUsuario: dto.nmUsuario.trim(),
    dsEmail: dto.dsEmail.trim().toLowerCase(),
    dsPerfilMobilidade: dto.dsPerfilMobilidade.trim() || 'Cidadão colaborador',
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

  // Caso o POST 201 retorne apenas o header Location (/usuarios/{id})
  if (location) {
    const match = location.match(/\/(\d+)\s*$/);
    if (match) {
      const novoId = Number(match[1]);
      return {
        cdUsuario: novoId,
        nmUsuario: payload.nmUsuario,
        dsEmail: payload.dsEmail,
        dsPerfilMobilidade: payload.dsPerfilMobilidade,
        dtCadastro: new Date().toISOString(),
      };
    }
  }

  // Fallback: consulta a lista de usuários para recuperar o cdUsuario recém-criado pelo e-mail
  const todos = await listarUsuarios();
  const encontrado = todos.find(
    (u) => u.dsEmail.trim().toLowerCase() === payload.dsEmail
  );
  if (encontrado) {
    return encontrado;
  }

  return {
    cdUsuario: 0,
    nmUsuario: payload.nmUsuario,
    dsEmail: payload.dsEmail,
    dsPerfilMobilidade: payload.dsPerfilMobilidade,
    dtCadastro: new Date().toISOString(),
  };
}

/**
 * Resolve o usuário pelo e-mail informado no formulário de relato (/relatos/novo):
 * 1. Busca em GET /usuarios um registro com o mesmo ds_email.
 * 2. Se encontrar, retorna o usuário existente.
 * 3. Se não encontrar, cadastra automaticamente via POST /usuarios e retorna o novo usuário.
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
      : emailLimpo.split('@')[0] || 'Cidadão Rotalivre';
  const perfilPadrao =
    params.dsPerfilMobilidade && params.dsPerfilMobilidade.trim().length > 0
      ? params.dsPerfilMobilidade.trim()
      : 'Cidadão colaborador';

  try {
    const usuarios = await listarUsuarios();
    const existente = usuarios.find(
      (u) => u.dsEmail.trim().toLowerCase() === emailLimpo
    );
    if (existente && existente.cdUsuario > 0) {
      return existente;
    }
  } catch {
    // Caso GET /usuarios não esteja disponível, tenta criar ou seguir para o POST de relato
  }

  try {
    const novo = await criarUsuario({
      nmUsuario: nomePadrao,
      dsEmail: emailLimpo,
      dsPerfilMobilidade: perfilPadrao,
    });
    return novo;
  } catch {
    return null;
  }
}
