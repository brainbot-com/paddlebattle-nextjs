'use client'

import axios from 'axios'
import {
  Award,
  Clock,
  DollarSign,
  ExternalLink,
  Gavel,
  Shield,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

import './globals.css'

type PaddleboardRow = {
  rank: string
  bidder: string
  bid: string
}

export default function AuctionPage() {
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
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Gavel className="h-8 w-8 text-purple-800" />
              <span className="font-serif font-bold text-xl text-purple-800">
                PaddleBattle
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="text-purple-800 border-purple-200"
              >
                <Clock className="h-3 w-3 mr-1" />
                Live Auction
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
              Premium Auction
            </Badge>
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-gray-900 mb-4 leading-tight">
              imKey Pro Hardware Wallet
              <span className="block text-purple-800">
                + Dragon Zodiac Figurine
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Open All Pay Auction hosted by{' '}
              <a
                href="https://imkey.im/"
                target="_blank"
                className="text-purple-800 font-semibold hover:underline"
                rel="noreferrer"
              >
                imKey
              </a>{' '}
              • 80% of proceeds donated to{' '}
              <a
                href="https://revoke.cash/"
                target="_blank"
                className="text-purple-800 font-semibold hover:underline"
                rel="noreferrer"
              >
                revoke.cash
              </a>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-purple-100">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/23171_935220.png"
                  alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
                  width={1200}
                  height={900}
                  className="rounded-xl w-full h-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Auction Info */}
            <div className="space-y-6">
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="font-serif text-2xl text-center text-gray-900">
                    Auction Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Timer className="h-5 w-5 text-purple-800" />
                      <span className="font-semibold text-gray-700">
                        Auction Ended
                      </span>
                    </div>
                    <p className="text-lg text-purple-800 font-semibold">
                      {auctionEndTime}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-purple-800 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Total Raised</p>
                      <p className="text-2xl font-bold text-purple-800">
                        ${totalRaised}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Trophy className="h-6 w-6 text-purple-800 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Highest Bid</p>
                      <p className="text-2xl font-bold text-purple-800">
                        ${highestBid}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      By participating, you agree to our{' '}
                      <a
                        href="https://www.paddlebattle.auction/terms"
                        target="_blank"
                        className="text-purple-800 hover:underline"
                        rel="noreferrer"
                      >
                        Terms & Conditions
                      </a>
                    </p>
                    <Button
                      disabled
                      className="w-full bg-gray-400 text-white cursor-not-allowed"
                    >
                      AUCTION CLOSED
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow border border-purple-100">
                  <Shield className="h-6 w-6 text-purple-800 mx-auto mb-2" />
                  <p className="text-sm font-semibold">All Pay</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow border border-purple-100">
                  <Zap className="h-6 w-6 text-purple-800 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Top-Up</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow border border-purple-100">
                  <Timer className="h-6 w-6 text-purple-800 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Popcorn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-gray-900 mb-12">
            Explore Our Curated Selection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                src: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/506583_673122.png',
                alt: 'Hosted by imKey',
              },
              {
                src: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/54602_550056.png',
                alt: 'Supporting Rotki',
              },
              {
                src: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/608601_96075.png',
                alt: 'Hardware Wallet Details',
              },
              {
                src: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/157891_920055.png',
                alt: 'Dragon Figurine',
              },
            ].map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={image.src || '/placeholder.svg'}
                  alt={image.alt}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auction Rules */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'All Pay Auction',
                description:
                  'All bidders pay - whether or not they win the prize. No refunds. This unique format ensures maximum contribution to our charitable cause.',
              },
              {
                icon: Zap,
                title: 'Top-Up Bidding',
                description:
                  'Increase your bid by making additional payments from the same address. Build your position strategically throughout the auction.',
              },
              {
                icon: Timer,
                title: 'Popcorn Bidding',
                description:
                  'Bids in the final 5 minutes extend the auction by 5 more minutes. The excitement continues until no bids are placed in the final window.',
              },
            ].map((rule, index) => (
              <Card
                key={index}
                className="border-purple-200 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="text-center">
                  <rule.icon className="h-12 w-12 text-purple-800 mx-auto mb-4" />
                  <CardTitle className="font-serif text-xl">
                    {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    {rule.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-gray-900 mb-12">
            Premium Prize Package
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-purple-100">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/926720_967227.png"
                  alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
                  width={1080}
                  height={1080}
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-800" />
                  imKey Pro Hardware Wallet
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      CC EAL6+ Certified Secure Chip for offline private key
                      protection
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Multi-Chain Support: 11+ blockchains including BTC, ETH,
                      DOT, ATOM
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ethereum Staking support via imToken app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      NFT Support on Layer 2 networks (zkSync, Arbitrum,
                      Optimism)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Compact & Portable: Only 17g with enhanced security
                      features
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-serif font-bold text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-800" />
                  Bonus: Dragon Zodiac Figurine
                </h3>
                <p className="text-gray-600 mb-4">
                  A special edition Dragon Zodiac figurine, created exclusively
                  by imKey to celebrate the Year of the Dragon. This collectible
                  is not available for purchase elsewhere and comes as a
                  limited-time gift.
                </p>
                <Badge className="bg-purple-100 text-purple-800">
                  🎉 All bidders receive 20% discount code for imKey products
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charitable Impact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-gray-900 mb-12">
            Supporting Digital Security
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-purple-100">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18570034/101927_119532.jpg"
                  alt="Revoke.cash logo"
                  width={1024}
                  height={1024}
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                Revoke.cash: Reclaim Control of Your Wallet
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Revoke.cash puts the power back in your hands — reclaim control
                of every approval living in your wallet. When you connect, it
                inspects permissions across more than 100 EVM‑compatible
                networks, showing exactly which smart contracts have
                unrestricted access to your tokens and NFTs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Use it proactively to develop good wallet hygiene by
                periodically sweeping approvals, especially after using
                marketplaces or swapping tokens. This reduces risk from phishing
                schemes and exploits.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-purple-100 text-purple-800">
                  80% of proceeds donated
                </Badge>
                <a
                  href="https://revoke.cash/"
                  target="_blank"
                  className="text-purple-800 hover:underline flex items-center gap-1"
                  rel="noreferrer"
                >
                  Learn more <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-gray-900 mb-12 flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-purple-800" />
            The Paddleboard
          </h2>
          <Card className="border-purple-200 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50 border-b border-purple-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-serif font-bold text-gray-900">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-gray-900">
                        Bidder
                      </th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-gray-900">
                        Bid (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {rows.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-purple-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-2xl">{row.rank}</td>
                        <td className="px-6 py-4 font-mono text-gray-700">
                          {row.bidder}
                        </td>
                        <td className="px-6 py-4 font-bold text-purple-800">
                          ${row.bid}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600">Dashboard updates every minute</p>
            <div className="flex justify-center gap-6 text-sm">
              <a
                href="https://t.me/+OokpsnnL_d81MGQ1"
                target="_blank"
                className="text-purple-800 hover:underline flex items-center gap-1"
                rel="noreferrer"
              >
                Get alerts on Telegram <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://etherscan.io/address/0x1EA385183A888D7a6c9B932440EF2F534534Ea2C#multichain-portfolio"
                target="_blank"
                className="text-purple-800 hover:underline flex items-center gap-1"
                rel="noreferrer"
              >
                View onchain <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-gray-900 mb-12">
            Auction Rules
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Open',
                description:
                  'All bids are publicly visible at all times. Check The Paddleboard and onchain to see the bids.',
              },
              {
                title: 'All Pay',
                description:
                  'Bidders place their bid(s) by paying the bid amount. Bidders pay regardless of whether or not they win the prize. No refunds.',
              },
              {
                title: 'yodl Link',
                description:
                  "All bids MUST be placed via the yodl link accessible from the 'BID NOW' button above.",
              },
              {
                title: 'Minimum Bid & Increments',
                description:
                  'The minimum bid is $1. All bids must be at least $1 higher than the previous high bid.',
              },
              {
                title: 'Top Ups',
                description:
                  'You may top up your bid by making an additional payment from the same address.',
              },
              {
                title: 'Popcorn Bidding',
                description:
                  'If one or more bid is placed in the final 5 minutes, the auction will be extended for an additional 5 minutes.',
              },
            ].map((rule, index) => (
              <Card
                key={index}
                className="border-purple-200 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="font-serif text-lg text-purple-800">
                    {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{rule.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="h-8 w-8 text-purple-800" />
                <span className="font-serif font-bold text-xl text-purple-800">
                  PaddleBattle
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Crypto auction platform for funding charities & impactful
                projects
              </p>
              <p className="text-sm text-gray-500">
                Made with ♡ by brainbot gmbh
              </p>
            </div>
            <div>
              <h4 className="font-serif font-bold text-gray-900 mb-4">Legal</h4>
              <div className="space-y-2">
                <a
                  href="https://www.paddlebattle.auction/terms"
                  target="_blank"
                  className="block text-gray-600 hover:text-purple-800 transition-colors"
                  rel="noreferrer"
                >
                  Terms & Conditions
                </a>
                <a
                  href="http://www.paddlebattle.auction/privacy-policy"
                  target="_blank"
                  className="block text-gray-600 hover:text-purple-800 transition-colors"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
                <a
                  href="http://www.paddlebattle.auction/imprint"
                  target="_blank"
                  className="block text-gray-600 hover:text-purple-800 transition-colors"
                  rel="noreferrer"
                >
                  Imprint
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-serif font-bold text-gray-900 mb-4">
                Connect
              </h4>
              <div className="space-y-2">
                <a
                  href="https://x.com/PaddleBattles"
                  target="_blank"
                  className="block text-gray-600 hover:text-purple-800 transition-colors"
                  rel="noreferrer"
                >
                  Twitter/X
                </a>
                <a
                  href="https://t.me/+OokpsnnL_d81MGQ1"
                  target="_blank"
                  className="block text-gray-600 hover:text-purple-800 transition-colors"
                  rel="noreferrer"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-200 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 PaddleBattle. Bid with Confidence - Discover Unique
              Treasures.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
