import { NovoRelatoDTO, Relato } from '../types';
import { apiFetch } from './api';
import { extrairListaDaResposta, normalizarRelato } from './normalizers';
import { resolverOuCriarUsuarioPorEmail } from './usuariosService';

/**
 * Serviços HTTP (Fetch API) para a entidade Relato (/locais/{id}/relatos)
 * Segue a seção 4 do Guia do Grupo:
 * - GET /locais/{id}/relatos -> 200 OK | 404 Not Found
 * - POST /locais/{id}/relatos -> 201 Created + Location | 400, 404, 409 Conflict
 */
export async function listarRelatosPorLocal(cdLocal: number): Promise<Relato[]> {
  const { data } = await apiFetch<unknown>(`/locais/${cdLocal}/relatos`, {
    method: 'GET',
  });
  const listaBruta = extrairListaDaResposta(data);
  return listaBruta.map((item) => normalizarRelato(item, cdLocal));
}

export async function criarRelatoNoLocal(
  cdLocal: number,
  dto: NovoRelatoDTO
): Promise<{
  relato: Relato | null;
  location: string | null;
}> {
  let cdUsuarioResolvido = dto.cdUsuario;

  // Abordagem híbrida inteligente acordada: resolve/cria usuário por e-mail em /usuarios
  if (!cdUsuarioResolvido || cdUsuarioResolvido <= 0) {
    const usuario = await resolverOuCriarUsuarioPorEmail({
      dsEmail: dto.dsEmail,
      nmUsuario: dto.nmUsuario,
      dsPerfilMobilidade: dto.dsPerfilMobilidade,
    });
    if (usuario && usuario.cdUsuario > 0) {
      cdUsuarioResolvido = usuario.cdUsuario;
    }
  }

  // Envia tanto cdUsuario quanto dsEmail para compatibilidade total com o DTO de entrada Java
  const payload: Record<string, unknown> = {
    cdLocal: Number(cdLocal),
    dsEmail: dto.dsEmail.trim().toLowerCase(),
    dsSituacao: dto.dsSituacao,
    dsObservacao: dto.dsObservacao.trim(),
  };

  if (cdUsuarioResolvido && cdUsuarioResolvido > 0) {
    payload.cdUsuario = Number(cdUsuarioResolvido);
  }
  if (dto.nmUsuario && dto.nmUsuario.trim()) {
    payload.nmUsuario = dto.nmUsuario.trim();
  }
  if (dto.dsPerfilMobilidade && dto.dsPerfilMobilidade.trim()) {
    payload.dsPerfilMobilidade = dto.dsPerfilMobilidade.trim();
  }

  const { data, location } = await apiFetch<unknown>(`/locais/${cdLocal}/relatos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const relatoCriado =
    data && typeof data === 'object' ? normalizarRelato(data, cdLocal) : null;

  return {
    relato: relatoCriado,
    location,
  };
}
