import { LocalAcessivel, NovoLocalDTO } from '../types';
import { apiFetch } from './api';
import { extrairListaDaResposta, normalizarLocalAcessivel } from './normalizers';

/**
 * Serviços HTTP (Fetch API) para a entidade LocalAcessivel (/locais)
 * Segue a tabela de rotas da seção 4 do Guia do Grupo (GET, POST, PUT, DELETE).
 */
export async function listarLocais(): Promise<LocalAcessivel[]> {
  const { data } = await apiFetch<unknown>('/locais', {
    method: 'GET',
  });
  const listaBruta = extrairListaDaResposta(data);
  return listaBruta.map((item) => normalizarLocalAcessivel(item));
}

export async function buscarLocalPorId(cdLocal: number): Promise<LocalAcessivel> {
  const { data } = await apiFetch<unknown>(`/locais/${cdLocal}`, {
    method: 'GET',
  });
  return normalizarLocalAcessivel(data);
}

export async function criarLocal(dto: NovoLocalDTO): Promise<{
  local: LocalAcessivel | null;
  location: string | null;
}> {
  // Envia os campos em camelCase (padrão DTO Java) para compatibilidade total
  const payload = {
    cdTipoLocal: Number(dto.cdTipoLocal),
    nmLocal: dto.nmLocal.trim(),
    dsEndereco: dto.dsEndereco.trim(),
    vlLatitude: Number(dto.vlLatitude),
    vlLongitude: Number(dto.vlLongitude),
    vlInclinacaoPct: Number(dto.vlInclinacaoPct),
    vlLarguraCm: Number(dto.vlLarguraCm),
    stAtivo: dto.stAtivo,
  };

  const { data, location } = await apiFetch<unknown>('/locais', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const localCriado =
    data && typeof data === 'object' ? normalizarLocalAcessivel(data) : null;

  return {
    local: localCriado,
    location,
  };
}

export async function atualizarLocal(
  cdLocal: number,
  dto: NovoLocalDTO
): Promise<LocalAcessivel> {
  const payload = {
    cdLocal: Number(cdLocal),
    cdTipoLocal: Number(dto.cdTipoLocal),
    nmLocal: dto.nmLocal.trim(),
    dsEndereco: dto.dsEndereco.trim(),
    vlLatitude: Number(dto.vlLatitude),
    vlLongitude: Number(dto.vlLongitude),
    vlInclinacaoPct: Number(dto.vlInclinacaoPct),
    vlLarguraCm: Number(dto.vlLarguraCm),
    stAtivo: dto.stAtivo,
  };

  const { data } = await apiFetch<unknown>(`/locais/${cdLocal}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return data && typeof data === 'object'
    ? normalizarLocalAcessivel(data)
    : normalizarLocalAcessivel(payload);
}

export async function excluirLocal(cdLocal: number): Promise<void> {
  await apiFetch<void>(`/locais/${cdLocal}`, {
    method: 'DELETE',
  });
}
