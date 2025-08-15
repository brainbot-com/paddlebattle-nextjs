'use client'

// Claude

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type PaddleboardRow = {
  rank: string
  bidder: string
  bid: string
}

export default function AuctionRedesign3() {
  const [auctionEndTime, setAuctionEndTime] = useState<string>('---')
  const [totalRaised, setTotalRaised] = useState<string>('---')
  const [highestBid, setHighestBid] = useState<string>('---')
  const [rows, setRows] = useState<PaddleboardRow[]>([])
  const [expandedRule, setExpandedRule] = useState<number | null>(null)

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

  const rules = [
    {
      title: 'Open Auction',
      content:
        'All bids are publicly visible at all times. Check The Paddleboard and onchain to see the bids.',
    },
    {
      title: 'All Pay System',
      content:
        'Bidders place their bid(s) by paying the bid amount. Bidders pay regardless of whether or not they win the prize. (This differs from traditional auctions, in which only the winner pays.) No refunds.',
    },
    {
      title: 'Yodl Link Required',
      content:
        'All bids MUST be placed via the yodl link accessible from the "BID NOW" button above.',
    },
    {
      title: 'Minimum Bid & Increments',
      content:
        'The minimum bid is $1. All bids must be at least $1 higher than the previous high bid.',
    },
    {
      title: 'Top Up Bids',
      content:
        'You may top up your bid by making an additional payment from the same address.',
    },
    {
      title: 'End Date & Time',
      content:
        'The auction will end on Tuesday, 5 August 2025 at 7:15 GMT | 15:15 GMT+8 - or at the end of Popcorn Bidding.',
    },
    {
      title: 'Popcorn Bidding',
      content:
        'If one or more bid is placed in the final 5 minutes, then the auction will be extended for an additional 5 minutes. This will continue until there is no bid in the final 5 minutes.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              Live Auction
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              imKey Pro Hardware Wallet
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              + Dragon Zodiac Figurine
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-gray-700">
              <div className="flex items-center">
                <span className="font-semibold text-red-600">
                  Open All Pay Auction
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center">
                <span>Hosted by</span>
                <a
                  href="https://imkey.im/"
                  target="_blank"
                  className="ml-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  imKey
                </a>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center">
                <span>80% donated to</span>
                <a
                  href="https://revoke.cash/"
                  target="_blank"
                  className="ml-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  revoke.cash
                </a>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-2xl">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/23171_935220.png"
                  alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
                  width={1200}
                  height={900}
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>

            {/* Auction Info */}
            <div className="space-y-8">
              {/* Auction Status Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Auction Ended
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {auctionEndTime}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Raised
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      ${totalRaised}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Highest Bid
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      ${highestBid}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    By clicking "BID NOW" you acknowledge this is an "All Pay"
                    auction and agree to Paddle Battle{' '}
                    <a
                      href="https://www.paddlebattle.auction/terms"
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-700"
                    >
                      Terms & Conditions
                    </a>
                    . You will be redirected to Yodl to complete your bid.
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                  CLOSED
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'All Pay',
              description:
                'All bidders pay - whether or not they win the prize. No refunds. See "Rules" below.',
              icon: '💰',
            },
            {
              title: 'Top-Up',
              description:
                'Top up your bid by making additional payment(s) from the same address.',
              icon: '📈',
            },
            {
              title: 'Popcorn Bidding',
              description:
                'If there is a bid in the final 5 minutes, the auction will be extended 5 minutes.',
              icon: '🍿',
            },
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-blue-200 h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              alt: 'A battle for imKey Pro Hardware Wallet + Dragon Zodiac Figurine',
            },
            {
              src: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/157891_920055.png',
              alt: 'Fight!',
            },
          ].map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={300}
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Prize Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Prize
          </h2>

          <div className="grid md:grid-cols-4 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/926720_967227.png"
                  alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
                  width={300}
                  height={300}
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-800">
                  The highest bidder will receive an imKey Pro hardware wallet,
                  a high-security cold wallet developed by imToken, a leading
                  Web3 wallet provider trusted by millions worldwide.
                </span>{' '}
                As a bonus, this listing also includes a limited-edition Dragon
                Zodiac figurine.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔐</span>
                    imKey Pro Features
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• CC EAL6+ Certified Secure Chip</li>
                    <li>• Multi-Chain Support (11+ blockchains)</li>
                    <li>• Ethereum Staking Support</li>
                    <li>• NFT Support (Layer 2)</li>
                    <li>• Compact & Portable (17g)</li>
                    <li>• Enhanced Security Features</li>
                  </ul>
                </div>

                <div className="bg-white/80 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎁</span>
                    Bonus Gifts
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700">
                        Dragon Zodiac Figurine
                      </p>
                      <p className="text-sm">
                        Limited edition collectible by imKey team
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        20% Discount Code
                      </p>
                      <p className="text-sm">
                        All bidders receive discount for imKey products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Project Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Impactful Project
          </h2>

          <div className="grid md:grid-cols-4 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4">
                <Image
                  src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18570034/101927_119532.jpg"
                  alt="Revoke.cash logo"
                  width={300}
                  height={300}
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <div className="space-y-4 text-gray-700">
                <p className="text-xl font-semibold text-gray-800">
                  Revoke.cash puts the power back in your hands — reclaim
                  control of every approval living in your wallet.
                </p>

                <p className="leading-relaxed">
                  When you connect (or even just enter your address), it
                  inspects permissions across more than 100 EVM‑compatible
                  networks. You see exactly which smart contracts have
                  unrestricted "infinite" access to your tokens and NFTs.
                </p>

                <p className="leading-relaxed">
                  With just a few clicks you can revoke or refine those
                  permissions — effectively cutting off any unwanted spending
                  power.
                </p>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                  <p className="text-orange-800 font-medium mb-2">
                    🛡️ Enhanced Security
                  </p>
                  <p className="text-gray-700 text-sm">
                    Install the Revoke.cash browser extension for real-time
                    warnings about token approvals, highlighting suspicious
                    behavior before you sign.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Paddleboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-slate-200">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            The Paddleboard
          </h2>

          <div className="space-y-4 mb-8">
            {rows.slice(0, 10).map((row, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{row.rank}</span>
                    <span className="text-gray-600 font-medium">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-gray-800 bg-gray-100 rounded-lg px-3 py-1 text-sm">
                      {row.bidder}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${row.bid}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/60 rounded-xl p-6 space-y-3 text-gray-600">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Dashboard updated every 1 minute
            </p>
            <p>
              Get new bid alerts on{' '}
              <a
                href="https://t.me/+OokpsnnL_d81MGQ1"
                target="_blank"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                Telegram
              </a>
            </p>
            <p>
              See all transactions{' '}
              <a
                href="https://etherscan.io/address/0x1EA385183A888D7a6c9B932440EF2F534534Ea2C#multichain-portfolio"
                target="_blank"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                onchain
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
          Rules
        </h2>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm"
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors rounded-xl"
                onClick={() =>
                  setExpandedRule(expandedRule === index ? null : index)
                }
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {rule.title}
                </h3>
                {expandedRule === index ? (
                  <ChevronUpIcon className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-gray-500" />
                )}
              </button>

              {expandedRule === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {rule.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <Image
                src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/18559109/173637_954355.png"
                alt="Paddle Battle Logo"
                width={150}
                height={65}
                className="mb-4 brightness-0 invert"
              />
              <p className="text-gray-300 text-lg max-w-md">
                Crypto auction platform for funding charities & impactful
                projects
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-3">
                <a
                  href="https://www.paddlebattle.auction/terms"
                  target="_blank"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
                <a
                  href="http://www.paddlebattle.auction/privacy-policy"
                  target="_blank"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="http://www.paddlebattle.auction/imprint"
                  target="_blank"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Imprint
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Follow Updates</h4>
              <div className="space-y-3">
                <a
                  href="https://x.com/PaddleBattles"
                  target="_blank"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Twitter/X
                </a>
                <a
                  href="https://t.me/+OokpsnnL_d81MGQ1"
                  target="_blank"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              Made with <span className="text-red-400">♡</span> by brainbot gmbh
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
