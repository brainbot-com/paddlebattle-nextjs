export const SHUTTER_API_BASE =
  'https://shutter-api.chiado.staging.shutter.network/api'

export const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE ||
  'https://pb-backend.generalmagic.io/api'

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
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  // Some endpoints may return empty body
  try {
    return (await response.json()) as T
  } catch {
    return undefined as unknown as T
  }
}

async function httpGet<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return (await response.json()) as T
}

export async function registerIdentity(
  decryptionTimestamp: number,
  identityPrefix: string,
): Promise<void> {
  await httpPost<void>(`${SHUTTER_API_BASE}/register_identity`, {
    decryptionTimestamp,
    identityPrefix,
  })
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
    identity: `0x${string}`
    eonKey: `0x${string}`
    epochId: `0x${string}`
  }
  signature: `0x${string}`
  messageToSign: string
  walletAddress: `0x${string}`
  decryptionTimestamp: number
}

export async function submitBidToBackend(
  payload: SealedFormData,
): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/submit-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.ok
  } catch {
    return false
  }
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
  try {
    const res = await fetch(`${BACKEND_API_BASE}/auctionBySlug/${slug}`)
    if (!res.ok) {
      return null
    }
    return (await res.json()) as Auction
  } catch {
    return null
  }
}

export async function fetchSealedAuctions(): Promise<Auction[]> {
  try {
    const res = await fetch(`${BACKEND_API_BASE}/auctions/sealed`)
    if (!res.ok) {
      return []
    }
    return (await res.json()) as Auction[]
  } catch {
    return []
  }
}
