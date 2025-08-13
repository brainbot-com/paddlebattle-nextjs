'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { fetchSealedAuctions, type Auction } from './utils/api'

// Dynamically import the entire wallet section with no SSR
const WalletSection = dynamic(() => import('./components/WalletSection'), {
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
    import('./components/WalletStatus').then(mod => ({
      default: mod.WalletStatus,
    })),
  {
    ssr: false,
    loading: () => null,
  },
)

export default function Home() {
  const router = useRouter()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      const data = await fetchSealedAuctions()
      if (cancelled) return
      setAuctions(data)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const options = useMemo(
    () =>
      auctions.map(a => ({
        label: `${a.name} (${a.slug})`,
        value: a.slug,
      })),
    [auctions],
  )
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

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a sealed-bid auction
            </label>
            <div className="flex gap-2">
              <select
                className="text-gray-700 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
                value={selectedSlug}
                onChange={e => setSelectedSlug(e.target.value)}
              >
                <option value="">
                  {loading ? 'Loading…' : 'Select an auction'}
                </option>
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!selectedSlug}
                onClick={() => selectedSlug && router.push(`/${selectedSlug}`)}
              >
                Go
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Shutter Network • Privacy-preserving sealed bids</p>
        </div>
      </div>
    </main>
  )
}
