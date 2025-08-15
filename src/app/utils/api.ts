import { httpGet, httpPost } from './axios'

export const BACKEND_API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE ||
  'https://pb-backend.generalmagic.io/api'

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

export interface SealedBid {
  id: number
  auctionSlug: string
  walletAddress: `0x${string}`
  encryptedBid: string
  decryptedBidAmount: number
  decryptionTimestamp: number
  createdAt: string
  updatedAt: string
  identity: `0x${string}`
  eon: number
  eonKey: `0x${string}`
  epochId: `0x${string}`
  txHash: `0x${string}`
  signature: `0x${string}`
  messageToSign: string
}

export interface SealedAuctionResult {
  auction: Auction
  attendees: SealedBid[]
  winner: SealedBid
}

export async function fetchSealedAuctionResult(
  slug: string,
): Promise<SealedAuctionResult | null> {
  return httpGet<SealedAuctionResult>(
    `${BACKEND_API_BASE}/auctions/sealed/${slug}/results`,
  )
}
