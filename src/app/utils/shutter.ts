import { encryptData } from '@shutter-network/shutter-sdk'

// Shutter API configuration
export const SHUTTER_CONFIG = {
  // Use Chiado testnet for development
  API_BASE: 'https://shutter-api.chiado.staging.shutter.network/api',
  // For production, use: 'https://shutter-api.shutter.network/api'

  // Default decryption delay (in seconds)
  DEFAULT_DECRYPTION_DELAY: 3600, // 1 hour
}

export interface ShutterIdentity {
  identity: string
  eonKey: string
  epochId: string
  identityPrefix: string
  decryptionTimestamp: number
}

export interface EncryptedBid {
  encryptedData: string
  identity: string
  eonKey: string
  epochId: string
  decryptionTimestamp: number
}

export interface BidData {
  bidAmount: string
  name: string
  email: string
  timestamp: number
}

/**
 * Register a new identity with Shutter API
 */
export async function registerShutterIdentity(
  decryptionTimestamp?: number,
  identityPrefix?: string,
): Promise<ShutterIdentity> {
  const timestamp =
    decryptionTimestamp ||
    Math.floor(Date.now() / 1000) + SHUTTER_CONFIG.DEFAULT_DECRYPTION_DELAY

  // Generate a proper 32-byte (64 hex character) identity prefix if not provided
  let prefix = identityPrefix
  if (!prefix) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    prefix = `0x${Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')}`
  }

  try {
    // Step 1: Register identity
    const registerResponse = await fetch(
      `${SHUTTER_CONFIG.API_BASE}/register_identity`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decryptionTimestamp: timestamp,
          identityPrefix: prefix,
        }),
      },
    )

    if (!registerResponse.ok) {
      throw new Error(
        `Failed to register identity: ${registerResponse.statusText}`,
      )
    }

    await registerResponse.json()

    // Step 2: Get encryption data
    const encryptionResponse = await fetch(
      `${SHUTTER_CONFIG.API_BASE}/get_data_for_encryption?address=0xb9C303443c9af84777e60D5C987AbF0c43844918&identityPrefix=${prefix}`,
    )

    if (!encryptionResponse.ok) {
      throw new Error(
        `Failed to get encryption data: ${encryptionResponse.statusText}`,
      )
    }

    const encryptionData = await encryptionResponse.json()

    return {
      identity: encryptionData.identity,
      eonKey: encryptionData.eon_key,
      epochId: encryptionData.epoch_id,
      identityPrefix: prefix,
      decryptionTimestamp: timestamp,
    }
  } catch (error) {
    console.error('Error registering Shutter identity:', error)
    throw error
  }
}

/**
 * Encrypt bid data using Shutter SDK
 */
export async function encryptBidData(
  bidData: BidData,
  shutterIdentity: ShutterIdentity,
): Promise<string> {
  try {
    // Convert bid data to hex string
    const messageHex =
      `0x${Buffer.from(JSON.stringify(bidData)).toString('hex')}` as `0x${string}`

    // Generate random sigma
    const sigmaHex =
      `0x${Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')}` as `0x${string}`

    // Encrypt the data
    const encryptedData = await encryptData(
      messageHex,
      shutterIdentity.eonKey as `0x${string}`,
      shutterIdentity.identity as `0x${string}`,
      sigmaHex,
    )

    return encryptedData
  } catch (error) {
    console.error('Error encrypting bid data:', error)
    throw error
  }
}

/**
 * Create a complete encrypted bid
 */
export async function createEncryptedBid(
  bidAmount: string,
  name: string,
  email: string,
  decryptionTimestamp?: number,
): Promise<EncryptedBid> {
  try {
    // Register identity with Shutter
    const identity = await registerShutterIdentity(decryptionTimestamp)

    // Prepare bid data
    const bidData = {
      bidAmount,
      name,
      email,
      timestamp: Date.now(),
    }

    // Encrypt the bid
    const encryptedData = await encryptBidData(bidData, identity)

    return {
      encryptedData,
      identity: identity.identity,
      eonKey: identity.eonKey,
      epochId: identity.epochId,
      decryptionTimestamp: identity.decryptionTimestamp,
    }
  } catch (error) {
    console.error('Error creating encrypted bid:', error)
    throw error
  }
}

/**
 * Get decryption key (only available after decryption timestamp)
 */
export async function getDecryptionKey(
  identity: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `${SHUTTER_CONFIG.API_BASE}/get_decryption_key?identity=${identity}`,
    )

    if (!response.ok) {
      if (response.status === 404) {
        // Key not yet available
        return null
      }
      throw new Error(`Failed to get decryption key: ${response.statusText}`)
    }

    const data = await response.json()
    return data.decryption_key
  } catch (error) {
    console.error('Error getting decryption key:', error)
    throw error
  }
}

/**
 * Decrypt commitment (only available after decryption timestamp)
 */
export async function decryptCommitment(
  identity: string,
  encryptedCommitment: string,
): Promise<BidData> {
  try {
    const response = await fetch(
      `${SHUTTER_CONFIG.API_BASE}/decrypt_commitment?identity=${identity}&encryptedCommitment=${encryptedCommitment}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to decrypt commitment: ${response.statusText}`)
    }

    const data = await response.json()

    // Convert hex string back to original data
    const decryptedHex = data.decrypted_message
    const decryptedString = Buffer.from(decryptedHex.slice(2), 'hex').toString()

    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Error decrypting commitment:', error)
    throw error
  }
}

/**
 * Utility function to format timestamps
 */
export function formatDecryptionTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

/**
 * Check if decryption time has passed
 */
export function isDecryptionTimeReached(timestamp: number): boolean {
  return Date.now() / 1000 >= timestamp
}
