'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { encryptData } from '@shutter-network/shutter-sdk'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { stringToHex } from 'viem'
import { useAccount, useSignMessage } from 'wagmi'
import { z } from 'zod'
import { Auction, submitBidToBackend } from '../utils/api'
import { getDataForEncryption, registerIdentity } from '../utils/shutter'
import { ConnectWalletModal } from './ConnectWalletModal'

// Form validation schema
const bidSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z.string(),
  bidAmount: z
    .string()
    .min(1, 'Bid amount is required')
    .regex(/^\d+(\.\d{1,18})?$/, 'Invalid bid amount'),
})

type BidFormData = z.infer<typeof bidSchema>

export default function SealedBidForm({ auction }: { auction?: Auction }) {
  const params = useParams<{ auctionSlug?: string }>()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBidAmount, setShowBidAmount] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [needsConnection, setNeedsConnection] = useState(false)

  useEffect(() => {
    if (address && needsConnection) {
      setNeedsConnection(false)
    }
  }, [address, needsConnection])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
  })

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!address) {
      event.preventDefault()
      setNeedsConnection(true)
      return
    }
    return handleSubmit(onSubmit)(event)
  }

  const onSubmit = async (data: BidFormData) => {
    if (!address) {
      setNeedsConnection(true)
      return
    }

    setIsSubmitting(true)
    setSubmissionStatus({ type: null, message: '' })

    try {
      const decryptionTimestamp = Math.floor(
        new Date(auction?.expirationTime || '').getTime() / 1000,
      )

      const registerIdentityResponse =
        await registerIdentity(decryptionTimestamp)

      const encryptionData = await getDataForEncryption(
        address,
        registerIdentityResponse.message.identity_prefix,
      )

      const bidData = {
        name: data.name,
        email: data.email,
        walletAddress: address,
        bidAmount: data.bidAmount,
        auctionSlug: params?.auctionSlug || auction?.slug || '',
        timestamp: Date.now(),
      }
      const msgHex = stringToHex(JSON.stringify(bidData))
      const sigmaHex = `0x${Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')}`

      const encryptedBid = await encryptData(
        msgHex as `0x${string}`,
        registerIdentityResponse.message.identity as `0x${string}`,
        registerIdentityResponse.message.eon_key as `0x${string}`,
        sigmaHex as `0x${string}`,
      )

      const messageToSign = `Sealed Bid Submission\n\nName: ${data.name}\nEmail: ${data.email}\nBid Identity Prefix: ${encryptionData.message.identity_prefix}\nTimestamp: ${Date.now()}`

      const signature = await signMessageAsync({
        message: messageToSign,
      })

      const auctionSlug = params?.auctionSlug || auction?.slug || ''

      await submitBidToBackend({
        auctionSlug,
        name: data.name,
        email: data.email,
        encryptedBid,
        encryptionKeys: {
          identityPrefix: registerIdentityResponse.message.identity_prefix,
          identity: registerIdentityResponse.message.identity,
          eon: registerIdentityResponse.message.eon,
          eonKey: registerIdentityResponse.message.eon_key,
          txHash: registerIdentityResponse.message.tx_hash,
          epochId: encryptionData.message.epoch_id,
        },
        signature,
        messageToSign,
        walletAddress: address,
        decryptionTimestamp,
      })

      setSubmissionStatus({
        type: 'success',
        message:
          'Bid submitted successfully! Your bid has been encrypted and will be revealed after the auction ends.',
      })

      reset()
    } catch (error) {
      console.error('Error submitting bid:', error)
      setSubmissionStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to submit bid. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submissionStatus.type === 'success') {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mx-auto my-5">
          <Image src="/images/logo.webp" alt="Logo" width={120} height={52} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Bid Submitted!
        </h2>
        <p className="text-gray-600 mb-6">{submissionStatus.message}</p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://twitter.com/intent/tweet?text=Just%20dropped%20my%20bid%20in%20the%20@PaddleBattles%20sealed-bid%20auction%20for%20two%20@EFDevcon%20tickets%20🎟%20with%20all%20auction%20proceeds%20going%20to%20@crecimientoar%0A%0APlace%20your%20bid%20now%20👉%20https%3A%2F%2Fwww.paddlebattle.auction%2Fdevconnect"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Share on X
          </a>
          <a
            href="https://farcaster.xyz/~/compose?text=Just%20dropped%20my%20bid%20in%20the%20@paddlebattle%20sealed-bid%20auction%20for%20two%20/devconnect%20tickets%20🎟%20with%20all%20auction%20proceeds%20going%20to%20@crecimiento%0A%0APlace%20your%20bid%20now%20👉%20https%3A%2F%2Fwww.paddlebattle.auction%2Fdevconnect"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Share on Farcaster
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mx-auto my-5">
          <Image src="/images/logo.webp" alt="Logo" width={120} height={52} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Submit Your Sealed Bid
        </h2>
        <p className="text-sm text-gray-600">
          Your bid will be encrypted using Shutter Network
        </p>
      </div>

      <div>
        <label
          htmlFor="auctionName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Auction
        </label>
        <input
          type="text"
          id="auctionName"
          value={auction?.name || params?.auctionSlug || ''}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
        />
      </div>
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name or Pseudonym
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 bg-white"
          placeholder="Enter your name or pseudonym"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email or Telegram
        </label>
        <input
          {...register('email')}
          type="text"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 bg-white"
          placeholder="Enter your email or telegram handle"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Bid Amount Field */}
      <div>
        <label
          htmlFor="bidAmount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Bid Amounts (USD)
        </label>
        <div className="relative">
          <input
            {...register('bidAmount')}
            type="number"
            style={
              showBidAmount
                ? {}
                : ({ WebkitTextSecurity: 'disc' } as React.CSSProperties)
            }
            id="bidAmount"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 bg-white"
            placeholder="100"
          />
          <button
            type="button"
            onClick={() => setShowBidAmount(!showBidAmount)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showBidAmount ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.bidAmount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.bidAmount.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Your bid amount will be encrypted and kept private until the auction
          ends
        </p>
      </div>

      {submissionStatus.type === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{submissionStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type={address ? 'submit' : 'button'}
        onClick={!address ? () => setNeedsConnection(true) : undefined}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-4 py-3 bg-[#f02a0b] text-white font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Encrypting & Submitting...
          </>
        ) : address ? (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Submit Encrypted Bid
          </>
        ) : (
          'Connect Wallet'
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Privacy Tip:</strong> All bid information will be publicly
              visible upon decryption at the end of the auction. If you do not
              wish to dox yourself, please create a pseudonym, generate a new
              email address and/or use a clean Ethereum address (no gas needed).
            </p>
          </div>
        </div>
      </div>

      <ConnectWalletModal
        open={!address && needsConnection}
        onClose={() => setNeedsConnection(false)}
        title="Connect Your Wallet"
      />
    </form>
  )
}
