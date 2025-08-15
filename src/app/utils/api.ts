import axios from 'axios'

export const SHUTTER_API_BASE =
  'https://shutter-api.chiado.staging.shutter.network/api'

export const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE ||
  'https://pb-backend.generalmagic.io/api'

function extractMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const record = data as Record<string, unknown>
  const fields = ['message', 'error', 'description']
  for (const field of fields) {
    const value = record[field]
    if (typeof value === 'string') return value
  }
  return undefined
}

export interface GetEncryptionDataResponse {
  message: {
    identity: `0x${string}`
    eon_key: `0x${string}`
    eon: number
    epoch_id: `0x${string}`
    identity_prefix: `0x${string}`
  }
}

async function httpPost<T>(url: string, body: unknown): Promise<T> {
  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data as T
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err.response?.status ?? 'ERR'
    const msg =
      extractMessage(err.response?.data) || err.message || 'Request failed'
    throw new Error(`Error (${status}): ${msg}`)
  }
}

async function httpGet<T>(url: string): Promise<T> {
  try {
    const response = await axios.get(url)
    return response.data as T
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err.response?.status ?? 'ERR'
    const body = err.response?.data
    if (typeof body === 'string') {
      throw new Error(body)
    }
    const msg = extractMessage(body) || err.message || 'Request failed'
    throw new Error(`Error (${status}): ${msg}`)
  }
}

interface RegisterIdentityResponse {
  message: {
    identity: `0x${string}`
    eon_key: `0x${string}`
    eon: number
    tx_hash: `0x${string}`
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

export interface SealedFormData {
  auctionSlug: string
  name: string
  email: string
  encryptedBid: string
  encryptionKeys: {
    identityPrefix: `0x${string}`
    identity: `0x${string}`
    eon: number
    eonKey: `0x${string}`
    epochId: `0x${string}`
    txHash: `0x${string}`
  }
  signature: `0x${string}`
  messageToSign: string
  walletAddress: `0x${string}`
  decryptionTimestamp: number
}

export async function submitBidToBackend(payload: SealedFormData) {
  return httpPost(
    `${BACKEND_API_BASE}/auctions/sealed/${payload.auctionSlug}/submit`,
    payload,
  )
}

export interface Auction {
  id: number
  name: string
  slug: string
  walletAddress: `0x${string}`
  expirationTime: string
  countDownTime: number
  type: string
  telegramChatId?: string
  telegramThreadId?: string
  winnerWalletAddress?: `0x${string}`
  createdAt: string
  updatedAt: string
}

export async function fetchAuctionBySlug(
  slug: string,
): Promise<Auction | null> {
  return httpGet<Auction>(`${BACKEND_API_BASE}/auctionBySlug/${slug}`)
}

export async function fetchSealedAuctions(): Promise<Auction[]> {
  return httpGet<Auction[]>(`${BACKEND_API_BASE}/auctions/sealed`)
}
