'use client'

// Grok 4

import { useEffect, useState } from 'react'
import { AuctionHeader } from './components/AuctionHeader'
import { BiddingInterface } from './components/BiddingInterface'
import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'

import './styles/globals.css'

type PaddleboardRow = {
  rank: string
  bidder: string
  bid: string
}

export default function App() {
  const [auctionEndTime, setAuctionEndTime] = useState<string>('---')
  const [totalRaised, setTotalRaised] = useState<string>('---')
  const [highestBid, setHighestBid] = useState<string>('---')
  const [rows, setRows] = useState<PaddleboardRow[]>([])

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    const datePart = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
    const timePart = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date)
    const tzMatch = date.toString().match(/GMT([+-]\d{4})/)
    const tz = tzMatch ? tzMatch[1] : ''
    return `${datePart} at ${timePart} (GMT${tz})`
  }

  const truncateOrEns = (address: string, ensMap: Record<string, string>) =>
    ensMap[address]
      ? ensMap[address]
      : `${address.slice(0, 4)} ... ${address.slice(-4)}`

  useEffect(() => {
    const slug = 'imkey'

    async function loadAuction() {
      try {
        const res = await fetch(
          `https://pb-backend.generalmagic.io/api/auctionBySlug/${slug}`,
        )
        const auction = await res.json()
        if (auction?.expirationTime)
          setAuctionEndTime(formatDate(auction.expirationTime))
      } catch (e) {
        // noop
      }
    }

    async function loadTxs() {
      try {
        const res = await fetch(
          `https://pb-backend.generalmagic.io/api/txsBySlug/${slug}`,
        )
        const txs: Array<{
          fromWalletAddress: string
          amount: number
          fromEns?: string
        }> = await res.json()

        const sumByAddress: Record<string, number> = {}
        const ensMap: Record<string, string> = {}
        for (const tx of txs) {
          sumByAddress[tx.fromWalletAddress] =
            (sumByAddress[tx.fromWalletAddress] || 0) + tx.amount
          if (tx.fromEns) ensMap[tx.fromWalletAddress] = tx.fromEns
        }

        const sorted = Object.entries(sumByAddress).sort((a, b) => b[1] - a[1])

        const total = sorted.reduce((acc, [, v]) => acc + v, 0)
        setTotalRaised(total.toFixed(2))
        setHighestBid(sorted.length ? sorted[0][1].toFixed(2) : '---')

        const nextRows: PaddleboardRow[] = sorted.map(([addr, sum], i) => {
          const n = i + 1
          let rank = `${n}`
          if (n === 1) rank = '🥇'
          else if (n === 2) rank = '🥈'
          else if (n === 3) rank = '🥉'
          else if (n === 4 || n === 5) rank = '🏅'
          return {
            rank,
            bidder: truncateOrEns(addr, ensMap),
            bid: sum.toFixed(2),
          }
        })
        setRows(nextRows)
      } catch (e) {
        // noop
      }
    }

    loadAuction()
    loadTxs()

    const id = setInterval(() => {
      loadTxs()
    }, 60_000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AuctionHeader />

      {/* New Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <ProductGallery /> {/* Integrate gallery as background or something */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              imKey Pro Hardware Wallet + Dragon Zodiac Figurine
            </h1>
            <p className="text-xl mb-8">Bid now in this exclusive auction</p>
            <BiddingInterface
              highestBid={highestBid}
              totalRaised={totalRaised}
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <ProductInfo rows={rows} auctionEndTime={auctionEndTime} />
        {/* Add more sections like leaderboard, rules in ProductInfo or separate */}
      </main>

      {/* Updated Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Modern footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PaddleBattle</h3>
              <p>Auction platform for impactful causes.</p>
            </div>
            <div>{/* Links */}</div>
            <div>{/* Social */}</div>
          </div>
          <p className="text-center mt-8">&copy; 2024 PaddleBattle</p>
        </div>
      </footer>
    </div>
  )
}
