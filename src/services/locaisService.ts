import { LocalAcessivel, NovoLocalDTO } from '../types';
import { apiFetch } from './api';
import { extrairListaDaResposta, normalizarLocalAcessivel } from './normalizers';

/**
 * Serviços HTTP (Fetch API) para a entidade LocalAcessivel (/locais)
 * Nomes dos campos no body JSON seguem estritamente os DTOs da API Java (Insomnia req_15 e req_18):
 * {
 *   "codigoTipoLocal": 2,
 *   "nome": "Rampa Teste",
 *   "endereco": "Av. Paulista, 1500",
 *   "latitude": -23.5614,
 *   "longitude": -46.6559,
 *   "inclinacaoPct": 7.5,
 *   "larguraCm": 120
 * }
 */
export async function listarLocais(): Promise<LocalAcessivel[]> {
  const { data } = await apiFetch<unknown>('/locais', {
    method: 'GET',
  });
  const listaBruta = extrairListaDaResposta(data);
  return listaBruta.map((item, idx) => normalizarLocalAcessivel(item, idx + 1));
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
  const payload = {
    codigoTipoLocal: Number(dto.cdTipoLocal),
    nome: dto.nmLocal.trim(),
    endereco: dto.dsEndereco.trim(),
    latitude: Number(dto.vlLatitude),
    longitude: Number(dto.vlLongitude),
    inclinacaoPct: Number(dto.vlInclinacaoPct),
    larguraCm: Number(dto.vlLarguraCm),
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
    codigoTipoLocal: Number(dto.cdTipoLocal),
    nome: dto.nmLocal.trim(),
    endereco: dto.dsEndereco.trim(),
    latitude: Number(dto.vlLatitude),
    longitude: Number(dto.vlLongitude),
    inclinacaoPct: Number(dto.vlInclinacaoPct),
    larguraCm: Number(dto.vlLarguraCm),
  };

  const { data } = await apiFetch<unknown>(`/locais/${cdLocal}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return data && typeof data === 'object'
    ? normalizarLocalAcessivel(data)
    : normalizarLocalAcessivel({ ...payload, codigo: cdLocal, stAtivo: dto.stAtivo });
}

export async function excluirLocal(cdLocal: number): Promise<void> {
  await apiFetch<void>(`/locais/${cdLocal}`, {
    method: 'DELETE',
  });
}
