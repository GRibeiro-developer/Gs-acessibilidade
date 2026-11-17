import { NovoRelatoDTO, Relato } from '../types';
import { apiFetch } from './api';
import { extrairListaDaResposta, normalizarRelato } from './normalizers';
import { resolverOuCriarUsuarioPorEmail } from './usuariosService';

/**
 * Serviços HTTP (Fetch API) para a entidade Relato (/locais/{id}/relatos e /relatos)
 * Nomes dos campos no body JSON seguem estritamente os DTOs da API Java (Insomnia req_22 e req_29):
 * {
 *   "emailUsuario": "maria.teste@exemplo.com",
 *   "situacao": "PARCIAL",
 *   "observacao": "Rampa com buraco no inicio"
 * }
 */
export async function listarTodosRelatos(): Promise<Relato[]> {
  const { data } = await apiFetch<unknown>('/relatos', {
    method: 'GET',
  });
  const listaBruta = extrairListaDaResposta(data);
  return listaBruta.map((item) => normalizarRelato(item));
}

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
  // Garante que o usuário com este e-mail esteja cadastrado em /usuarios antes de enviar o relato
  await resolverOuCriarUsuarioPorEmail({
    dsEmail: dto.dsEmail,
    nmUsuario: dto.nmUsuario,
    dsPerfilMobilidade: dto.dsPerfilMobilidade,
  });

  // Envia exatamente o formato esperado pela req_22 do Insomnia da API Java
  const payload = {
    emailUsuario: dto.dsEmail.trim().toLowerCase(),
    situacao: dto.dsSituacao,
    observacao: dto.dsObservacao.trim(),
  };

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
