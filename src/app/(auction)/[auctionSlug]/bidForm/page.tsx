'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Footer from '../../../components/Footer'
import { fetchAuctionBySlug, type Auction } from '../../../utils/api'

const SealedBidForm = dynamic(
  () => import('../../../components/SealedBidForm'),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    ),
  },
)

const WalletStatus = dynamic(() => import('../../../components/WalletStatus'), {
  ssr: false,
  loading: () => null,
})

enum ErrorType {
  AuctionNotFound = 'Auction not found!',
  AuctionNotSealed = 'AuctionNotSealed',
  AuctionEnded = 'AuctionEnded',
  Unknown = 'Unknown',
}

export default function BidFormPage() {
  const { auctionSlug } = useParams<{ auctionSlug: string }>()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAuctionBySlug(auctionSlug)
        if (cancelled) return
        if (data?.type !== 'sealed') {
          setError(`This auction is not a sealed-bid auction!`)
          setAuction(data)
        } else {
          setAuction(data)
        }
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
        setError(ErrorType.AuctionNotFound)
      }
    }

    if (auctionSlug) load()
    return () => {
      cancelled = true
    }
  }, [auctionSlug])

  const isEnded = useMemo(() => {
    if (!auction) return false
    return new Date(auction.expirationTime).getTime() <= Date.now()
  }, [auction])

  return (
    <main className="min-h-screen bg-[#cedcf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4 max-w-xs">
        <WalletStatus />
      </div>

      <div className="max-w-md mx-auto">
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
                href={
                  error === ErrorType.AuctionNotFound
                    ? '/'
                    : `https://www.paddlebattle.auction/${auctionSlug}`
                }
                className="inline-block px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                target="_blank"
                rel="noreferrer"
              >
                Go to{' '}
                {error === ErrorType.AuctionNotFound
                  ? 'home'
                  : 'regular auction'}{' '}
                page
              </a>
            </div>
          ) : isEnded ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Auction Ended
              </h2>
              <p className="text-gray-600 mb-6">
                Bidding period is over. You can view the results.
              </p>
              <a
                href={`/${auction?.slug}/result`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Results
              </a>
            </div>
          ) : (
            <SealedBidForm auction={auction || undefined} />
          )}
        </div>

        <Footer className="mt-8" />
      </div>
    </main>
  )
}
