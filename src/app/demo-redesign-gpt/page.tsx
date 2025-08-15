'use client'

// GPT 5

import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type PaddleboardRow = {
  rank: string
  bidder: string
  bid: string
}

export default function TestPage() {
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-700">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
                Auction Closed
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                imKey Pro Auction
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-slate-600">
                Open All‑Pay Auction • Hosted by{' '}
                <a
                  href="https://imkey.im/"
                  target="_blank"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  imKey
                </a>{' '}
                • 80% donated to{' '}
                <a
                  href="https://revoke.cash/"
                  target="_blank"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  revoke.cash
                </a>
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Auction Ended
                  </p>
                  <p
                    id="auction_expiration_time"
                    className="mt-2 text-base font-semibold text-indigo-600"
                  >
                    {auctionEndTime}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Total Raised
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-900">
                    ${totalRaised}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Highest Bid
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-rose-600">
                    ${highestBid}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                By proceeding you agree to Paddle Battle{' '}
                <a
                  href="https://www.paddlebattle.auction/terms"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  Terms & Conditions
                </a>
                .
              </p>

              <div className="mt-4">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
                  aria-disabled
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                  Closed
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-2 shadow-xl backdrop-blur">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/23171_935220.png"
                  alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
                  width={1200}
                  height={900}
                  className="h-auto w-full rounded-2xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">All‑Pay</h3>
            <p className="mt-2 text-slate-600">
              All bidders pay whether or not they win. No refunds.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Top‑Up</h3>
            <p className="mt-2 text-slate-600">
              Increase your bid with additional payments from the same address.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Popcorn Bidding
            </h3>
            <p className="mt-2 text-slate-600">
              Bids in the last 5 minutes extend the auction by 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Prize */}
      <section className="bg-slate-50/60 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Prize
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <Image
                src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/926720_967227.png"
                alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
                width={1080}
                height={1080}
                className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm w-full h-auto"
              />
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-700 text-lg">
                <strong>
                  The highest bidder receives an imKey Pro hardware wallet
                </strong>
                , a high‑security cold wallet by imToken, plus a limited‑edition
                Dragon Zodiac figurine.
              </p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <li className="rounded-xl border border-slate-200 bg-white p-4">
                  CC EAL6+ secure chip for offline key generation
                </li>
                <li className="rounded-xl border border-slate-200 bg-white p-4">
                  Multi‑chain support including BTC, ETH, DOT, ATOM, FIL
                </li>
                <li className="rounded-xl border border-slate-200 bg-white p-4">
                  Supports EVM chains (BNB, Polygon, Arbitrum, Optimism)
                </li>
                <li className="rounded-xl border border-slate-200 bg-white p-4">
                  ETH staking via imToken app
                </li>
                <li className="rounded-xl border border-slate-200 bg-white p-4">
                  Layer‑2 NFT support (zkSync, Arbitrum, Optimism)
                </li>
                <li className="rounded-xl border border-slate-200 bg-white p-4">
                  PIN protection, binding codes, auto‑reset safeguards
                </li>
              </ul>
              <p className="mt-6 text-slate-700">
                All bidders receive a 20% discount code for imKey products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impactful Project */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Impactful Project
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18570034/101927_119532.jpg"
              alt="Revoke.cash logo"
              width={1024}
              height={1024}
              className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm w-full h-auto"
            />
          </div>
          <div className="md:col-span-2 text-slate-700 space-y-4">
            <p className="text-lg font-semibold text-slate-900">
              Revoke.cash helps you monitor and revoke token approvals across
              100+ EVM networks.
            </p>
            <p>
              See which contracts have spending power, revoke risky approvals,
              and protect yourself against exploits and phishing.
            </p>
            <p>
              Install the Revoke.cash browser extension for real‑time warnings
              when signing token approvals.
            </p>
          </div>
        </div>
      </section>

      {/* Paddleboard */}
      <section className="bg-slate-50/60 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              The Paddleboard
            </h2>
            <span className="text-sm text-slate-500">
              Auto‑refreshes every minute
            </span>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Rank</th>
                    <th className="px-4 py-3 font-semibold">Bidder</th>
                    <th className="px-4 py-3 font-semibold">Bid (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {rows.map((r, i) => {
                    let rowBgClass = ''
                    if (i === 0) rowBgClass = 'bg-amber-50'
                    else if (i === 1) rowBgClass = 'bg-slate-50'
                    else if (i === 2) rowBgClass = 'bg-stone-50'
                    return (
                      <tr key={i} className={rowBgClass}>
                        <td className="px-4 py-3 font-semibold">{r.rank}</td>
                        <td className="px-4 py-3">{r.bidder}</td>
                        <td className="px-4 py-3 font-mono tabular-nums">
                          ${r.bid}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 text-slate-600">
            <p>
              Get bid alerts on{' '}
              <a
                href="https://t.me/+OokpsnnL_d81MGQ1"
                target="_blank"
                className="text-indigo-600 underline underline-offset-2"
              >
                Telegram
              </a>
              . See all transactions{' '}
              <a
                href="https://etherscan.io/address/0x1EA385183A888D7a6c9B932440EF2F534534Ea2C#multichain-portfolio"
                target="_blank"
                className="text-indigo-600 underline underline-offset-2"
              >
                on‑chain
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Rules</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Open</h3>
            <p className="mt-2 text-slate-600">
              All bids are publicly visible on the Paddleboard and on‑chain.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">All‑Pay</h3>
            <p className="mt-2 text-slate-600">
              Bids are payments. All bidders pay, regardless of winning. No
              refunds.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Yodl Link</h3>
            <p className="mt-2 text-slate-600">
              Bids must be placed via the official Yodl link.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Min Bid & Increments
            </h3>
            <p className="mt-2 text-slate-600">
              Minimum bid is $1. Each new high bid must exceed the previous by
              at least $1.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Top‑Ups</h3>
            <p className="mt-2 text-slate-600">
              You may increase your bid with additional payments from the same
              address.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">End Time</h3>
            <p className="mt-2 text-slate-600">
              Ends Tuesday, 5 August 2025 at 7:15 GMT | 15:15 GMT+8, or after
              Popcorn Bidding concludes.
            </p>
            <p className="mt-2 text-slate-600">
              Livestream at 7:00 GMT | 15:00 GMT+8 on{' '}
              <a
                href="https://x.com/PaddleBattles"
                target="_blank"
                className="text-indigo-600 underline underline-offset-2"
              >
                X/Twitter
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <Image
                src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/18559109/173637_954355.png"
                alt="Paddle Battle Logo"
                width={150}
                height={65}
                className="mb-3"
              />
              <p className="text-slate-700">
                Crypto auction platform for funding charities & impactful
                projects.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 text-slate-600">
              <a
                href="https://www.paddlebattle.auction/terms"
                target="_blank"
                className="hover:text-slate-900"
              >
                Terms & Conditions
              </a>
              <a
                href="http://www.paddlebattle.auction/privacy-policy"
                target="_blank"
                className="hover:text-slate-900"
              >
                Privacy Policy
              </a>
              <a
                href="http://www.paddlebattle.auction/imprint"
                target="_blank"
                className="hover:text-slate-900"
              >
                Imprint
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-slate-500">
            Made with <span className="text-slate-800">♡</span> by brainbot gmbh
          </div>
        </div>
      </footer>
    </main>
  )
}
