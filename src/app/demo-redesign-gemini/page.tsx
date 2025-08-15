'use client'

// Gemini 2.5

import axios from 'axios'
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
        const res = await axios.get(
          `https://pb-backend.generalmagic.io/api/auctionBySlug/${slug}`,
        )
        const auction = res.data
        if (auction?.expirationTime)
          setAuctionEndTime(formatDate(auction.expirationTime))
      } catch (e) {
        // noop
      }
    }

    async function loadTxs() {
      try {
        const res = await axios.get(
          `https://pb-backend.generalmagic.io/api/txsBySlug/${slug}`,
        )
        const txs: Array<{
          fromWalletAddress: string
          amount: number
          fromEns?: string
        }> = res.data

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
    <div className="min-h-screen bg-gray-50">
      <AuctionHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <ProductGallery />
            <ProductInfo />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BiddingInterface />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-600">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                PaddleBattle
              </h3>
              <p className="text-sm">
                The premier online auction house for exclusive digital and
                physical collectibles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Auctions</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-red-500">
                    Current Auctions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500">
                    Upcoming
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500">
                    Past Results
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-red-500">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-red-500">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-500">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 PaddleBattle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
