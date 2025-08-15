'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { truncateOrEns } from '@/app/utils/helpers'
import {
  Auction,
  fetchSealedAuctionResult,
  type SealedBid,
} from '../../../utils/api'

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
  const [bids, setBids] = useState<SealedBid[] | null>(null)
  const [auction, setAuction] = useState<Auction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const winnerAddress = auction?.winnerWalletAddress
    ? truncateOrEns(auction.winnerWalletAddress, {})
    : 'TBD'

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchSealedAuctionResult(auctionSlug)
        if (cancelled) return
        setBids(data?.attendees || null)
        setAuction(data?.auction || null)
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
        setError(e instanceof Error ? e.message : 'Unknown error')
      }
    }
    if (auctionSlug) load()
    return () => {
      cancelled = true
    }
  }, [auctionSlug])

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
            <div className="text-center">
              <div className="text-gray-900 mb-5">{error}</div>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to home page
              </Link>
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
                    {winnerAddress}
                  </span>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Ended at: {new Date(auction!.expirationTime).toLocaleString()}
                </p>
              </div>

              {/* Attendees Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  All Attendees ({bids?.length})
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="text-sm text-gray-500">Bid Amount</p>
                </div>
                <div className="space-y-3">
                  {[...(bids || [])]
                    .sort((a, b) => b.decryptedBidAmount - a.decryptedBidAmount)
                    .map((bid, index) => (
                      <div
                        key={bid.id}
                        className="flex justify-between items-center p-3 rounded-lg border border-gray-200 bg-white"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="relative group">
                            <p className="text-sm font-mono text-gray-900 cursor-pointer">
                              {truncateOrEns(bid.walletAddress, {})}
                            </p>
                            {/* Tooltip */}
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {bid.walletAddress}
                                {/* Arrow */}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ${bid.decryptedBidAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
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
