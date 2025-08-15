import { httpGet, httpPost } from './axios'

export const SHUTTER_API_BASE =
  'https://shutter-api.chiado.staging.shutter.network/api'

interface RegisterIdentityResponse {
  message: {
    identity: `0x${string}`
    eon_key: `0x${string}`
    eon: number
    tx_hash: `0x${string}`
    identity_prefix: `0x${string}`
  }
}

interface GetEncryptionDataResponse {
  message: {
    identity: `0x${string}`
    eon_key: `0x${string}`
    eon: number
    epoch_id: `0x${string}`
    identity_prefix: `0x${string}`
  }
}

export async function registerIdentity(
  decryptionTimestamp: number,
  identityPrefix?: string,
): Promise<RegisterIdentityResponse> {
  if (!identityPrefix) {
    return httpPost<RegisterIdentityResponse>(
      `${SHUTTER_API_BASE}/register_identity`,
      {
        decryptionTimestamp,
      },
    )
  } else {
    return httpPost<RegisterIdentityResponse>(
      `${SHUTTER_API_BASE}/register_identity`,
      {
        decryptionTimestamp,
        identityPrefix,
      },
    )
  }
}

export async function getDataForEncryption(
  address: string,
  identityPrefix: string,
): Promise<GetEncryptionDataResponse> {
  const qs = new URLSearchParams({ address, identityPrefix }).toString()
  return await httpGet<GetEncryptionDataResponse>(
    `${SHUTTER_API_BASE}/get_data_for_encryption?${qs}`,
  )
}
