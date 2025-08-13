'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchAuctionBySlug, type Auction } from '../../utils/api'

// Dynamically import the entire wallet section with no SSR
const WalletSection = dynamic(() => import('../../components/WalletSection'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      </div>
      <p className="text-gray-600">Loading...</p>
    </div>
  ),
})

// Dynamically import WalletStatus for top left display
const WalletStatus = dynamic(
  () =>
    import('../../components/WalletStatus').then(mod => ({
      default: mod.WalletStatus,
    })),
  {
    ssr: false,
    loading: () => null,
  },
)

export default function AuctionPage() {
  const { auctionSlug } = useParams<{ auctionSlug: string }>()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
      } else if (data.type !== 'sealed') {
        setError(
          `This auction is not a sealed-bid auction. To place a bid, visit https://www.paddlebattle.auction/${auctionSlug}`,
        )
        setAuction(data)
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Wallet Status - Top Right */}
      <div className="absolute top-4 right-4 max-w-xs">
        <WalletStatus />
      </div>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sealed Bid Auction
          </h1>
          <p className="text-gray-600">
            Submit your encrypted bid using Shutter Network
          </p>
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
              <a
                href={`https://www.paddlebattle.auction/${auctionSlug}`}
                className="inline-block px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                target="_blank"
                rel="noreferrer"
              >
                Go to regular auction page
              </a>
            </div>
          ) : (
            <WalletSection auction={auction || undefined} />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Shutter Network • Privacy-preserving sealed bids</p>
        </div>
      </div>
    </main>
  )
}
