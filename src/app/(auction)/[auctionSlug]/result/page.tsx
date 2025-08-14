'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { truncateOrEns } from '@/app/utils/helpers'
import { fetchAuctionBySlug, type Auction } from '../../../utils/api'

const WalletStatus = dynamic(
  () =>
    import('../../../components/WalletStatus').then(mod => ({
      default: mod.WalletStatus,
    })),
  {
    ssr: false,
    loading: () => null,
  },
)

export default function ResultPage() {
  const { auctionSlug } = useParams<{ auctionSlug: string }>()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const winner = auction?.winnerWalletAddress
    ? truncateOrEns(auction.winnerWalletAddress, {})
    : 'TBD'

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      const data = await fetchAuctionBySlug(auctionSlug)
      if (cancelled) return
      if (!data) {
        setError('Auction not found.')
        setAuction(null)
      } else {
        setAuction(data)
      }
      setLoading(false)
    }
    if (auctionSlug) load()
    return () => {
      cancelled = true
    }
  }, [auctionSlug])

  const isRunning = useMemo(() => {
    if (!auction) return false
    return new Date(auction.expirationTime).getTime() > Date.now()
  }, [auction])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4 max-w-xs">
        <WalletStatus />
      </div>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auction Result
          </h1>
          <p className="text-gray-600">View the outcome and winner details.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-600">Loading auction…</p>
            </div>
          ) : error ? (
            <div className="text-center space-y-3">
              <p className="text-red-600">{error}</p>
            </div>
          ) : isRunning ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Auction Still Running
              </h2>
              <p className="text-gray-600 mb-6">
                Results will be available after the auction ends. You can place
                a sealed bid now.
              </p>
              <a
                href={`/${auction?.slug}/bidForm`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Bid Form
              </a>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {auction?.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">/{auction?.slug}</p>
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-700">
                  Winner Wallet Address:
                  <span className="ml-2 font-mono text-sm font-semibold text-gray-900">
                    {winner}
                  </span>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Ended at: {new Date(auction!.expirationTime).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Shutter Network • Privacy-preserving sealed bids</p>
        </div>
      </div>
    </main>
  )
}
