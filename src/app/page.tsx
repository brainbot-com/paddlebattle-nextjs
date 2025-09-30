'use client'

import { useEffect, useMemo, useState } from 'react'
import AuctionCard from './components/AuctionCard'
import Footer from './components/Footer'
import { fetchSealedAuctions, type Auction } from './utils/api'

export default function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchSealedAuctions()
        if (cancelled) return
        setAuctions(data)
      } catch (e) {
        if (!cancelled) setError('Failed to load auctions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const { runningAuctions, endedAuctions } = useMemo(() => {
    const now = Date.now()
    const running = auctions.filter(
      a => new Date(a.expirationTime).getTime() > now,
    )
    const ended = auctions.filter(
      a => new Date(a.expirationTime).getTime() <= now,
    )
    return { runningAuctions: running, endedAuctions: ended }
  }, [auctions])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sealed-Bid Auctions
          </h1>
          <p className="text-gray-600">
            Browse running and ended auctions. Place encrypted bids securely.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-xl rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Running auctions
            </h2>
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
          </div>
          {runningAuctions.length === 0 && !loading ? (
            <p className="text-sm text-gray-600">
              No running auctions right now.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {runningAuctions.map(a => (
                <AuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Ended auctions
            </h2>
          </div>
          {endedAuctions.length === 0 && !loading ? (
            <p className="text-sm text-gray-600">No ended auctions yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {endedAuctions.map(a => (
                <AuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </section>

        <Footer className="mt-10" />
      </div>
    </main>
  )
}
