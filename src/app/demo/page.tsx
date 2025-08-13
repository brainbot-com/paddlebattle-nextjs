'use client'

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
    <main className="min-h-screen bg-white text-[#50555c]">
      {/* Header/Hero */}
      <section className="py-[75px] px-[3%] max-w-[1200px] mx-auto flex flex-col items-center justify-center">
        <div className="w-full text-left mb-8">
          <h1 className="text-5xl font-bold text-[#202124] mb-2">
            imKey Pro Hardware Wallet + Dragon Zodiac Figurine
          </h1>
          <p className="text-2xl text-[#f02a0b] font-bold">
            Open All Pay Auction | Hosted by{' '}
            <a
              href="https://imkey.im/"
              target="_blank"
              className="text-[#5b8ae6]"
            >
              <strong>imKey</strong>
            </a>{' '}
            | 80% of Auction Proceeds Donated to{' '}
            <a
              href="https://revoke.cash/"
              target="_blank"
              className="text-[#5b8ae6]"
            >
              <strong>revoke.cash</strong>
            </a>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="md:w-7/12">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/23171_935220.png"
              alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
              width={1200}
              height={900}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:w-5/12 flex flex-col items-center justify-center p-6 bg-[#cedcf8] rounded-lg shadow-lg border border-black">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold mb-4">
                <div>Auction Ended on:</div>
                <div id="auction_expiration_time" className="text-[#5b8ae6]">
                  {auctionEndTime}
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-[#222222]">
                Total Raised:
              </h3>
              <h3 className="text-2xl font-bold text-[#5b8ae6]">
                ${totalRaised}
              </h3>
              <h3 className="text-2xl font-bold text-[#222222]">
                Highest Bid:
              </h3>
              <h3 className="text-2xl font-bold text-[#f02a0b]">
                ${highestBid}
              </h3>
            </div>
            <p className="text-sm text-center mb-4">
              By clicking on the "BID NOW" button below, you acknowledge this is
              an "All Pay" auction, and you agree to Paddle Battle{' '}
              <a
                href="https://www.paddlebattle.auction/terms"
                target="_blank"
                className="underline"
              >
                Terms & Conditions
              </a>
              . You will be redirected to Yodl to complete your bid.
            </p>
            <button className="px-6 py-3 bg-[#f02a0b] text-white font-bold rounded-md">
              CLOSED
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-0 px-[3%] max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="w-full">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/506583_673122.png"
              alt="Hosted by imKey"
              width={300}
              height={300}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="w-full">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/54602_550056.png"
              alt="Supporting Rotki"
              width={300}
              height={300}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="w-full">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/608601_96075.png"
              alt="A battle for imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
              width={300}
              height={300}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="w-full">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/157891_920055.png"
              alt="Fight!"
              width={300}
              height={300}
              className="rounded-md w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Auction section */}
      <section className="py-[75px] px-[3%] max-w-[1200px] mx-auto">
        <h1 className="text-5xl font-bold text-[#1d2023] mb-8 text-left">
          Auction
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">All Pay</h3>
            <p className="text-lg text-[#222222]">
              All bidders pay - whether or not they win the prize. No refunds.
              See "Rules" below.
            </p>
          </div>
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">Top-Up</h3>
            <p className="text-lg text-[#222222]">
              Top up your bid by making additional payment(s) from the same
              address.
            </p>
          </div>
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">
              Popcorn Bidding
            </h3>
            <p className="text-lg text-[#222222]">
              If there is a bid in the final 5 minutes, the auction will be
              extended 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Prize */}
      <section className="py-[75px] px-[3%] max-w-[1200px] mx-auto bg-[#cedcf8]">
        <h1 className="text-5xl font-bold text-[#1d2023] mb-8 text-left">
          Prize
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-2/12">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/926720_967227.png"
              alt="imKey Pro Hardware Wallet + Dragon Zodiac Figurine"
              width={1080}
              height={1080}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="md:w-10/12 text-left">
            <p className="text-lg text-[#222222] mb-4">
              <strong>
                The highest bidder will receive an imKey Pro hardware wallet, a
                high-security cold wallet developed by imToken, a leading Web3
                wallet provider trusted by millions worldwide. As a bonus, this
                listing also includes a limited-edition Dragon Zodiac figurine,
                a commemorative gift item designed by the imKey team.
              </strong>
            </p>
            <p className="text-lg text-[#202124] mb-2">
              🔐 <strong>imKey Pro Hardware Wallet</strong>
            </p>
            <ul className="list-disc list-inside text-lg text-[#202124] mb-4">
              <li>
                CC EAL6+ Certified Secure Chip: Ensures offline private key
                generation and protection from online threats.
              </li>
              <li>
                Multi-Chain Support: Compatible with over 11 major blockchains
                including Bitcoin (BTC), Ethereum (ETH), Polkadot (DOT), Cosmos
                (ATOM), Filecoin (FIL) and more. Also supports EVM chains (e.g.,
                BNB Chain, Polygon, Arbitrum, Optimism).
              </li>
              <li>
                Ethereum Staking: Supports ETH staking via the imToken app for
                secure and convenient participation.
              </li>
              <li>
                NFT Support (Layer 2): Enables NFT access and interaction on
                selected Layer 2 networks like zkSync, Arbitrum, and Optimism.
              </li>
              <li>
                Compact & Portable: Lightweight (17g), durable, and perfect for
                on-the-go storage of your digital assets.
              </li>
              <li>
                Enhanced Security Features: PIN protection, binding codes, and
                auto-reset after multiple failed login attempts.
              </li>
            </ul>
            <p className="text-lg text-[#202124] mb-2">
              🎁 <strong>Bonus Gift – Dragon Zodiac Figurine</strong>
            </p>
            <p className="text-lg text-[#202124] mb-4">
              As a token of appreciation, this auction includes a special
              edition Dragon Zodiac figurine, created by imKey to celebrate the
              Year of the Dragon. This collectible is not for sale elsewhere and
              is available only as a limited-time gift.
            </p>
            <p className="text-lg text-[#0f0e12] mb-2">
              🎉 <strong>Participation Prize:</strong>
            </p>
            <p className="text-lg text-black">
              All bidders receive a 20% discount code for imKey products.
            </p>
          </div>
        </div>
      </section>

      {/* Impactful Project */}
      <section className="py-[75px] px-[3%] max-w-[1200px] mx-auto">
        <h1 className="text-5xl font-bold text-[#1d2023] mb-8 text-left">
          Impactful Project
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-2/12">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18570034/101927_119532.jpg"
              alt="Revoke.cash logo"
              width={1024}
              height={1024}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="md:w-10/12 text-left">
            <p className="text-lg text-[#2c0802] mb-4">
              <strong>
                Revoke.cash puts the power back in your hands — reclaim control
                of every approval living in your wallet.
              </strong>
            </p>
            <p className="text-lg text-[#2c0802] mb-4">
              When you connect (or even just enter your address), it inspects
              permissions across more than 100 EVM‑compatible networks. You see
              exactly which smart contracts have unrestricted “infinite” access
              to your tokens and NFTs. With just a few clicks you can revoke or
              refine those permissions — effectively cutting off any unwanted
              spending power.
            </p>
            <p className="text-lg text-[#2c0802] mb-4">
              Revoke.cash isn’t just a reactive tool — use it proactively.
              Develop good wallet hygiene by periodically sweeping approvals,
              especially after using marketplaces or swapping tokens. Doing so
              reduces risk from phishing schemes and exploits. And if you ever
              fall victim to a scam, revoke the suspect approvals immediately to
              stop further losses.
            </p>
            <p className="text-lg text-[#2c0802]">
              For enhanced security, install the Revoke.cash browser extension.
              It warns you in real time if you’re about to sign a token
              approval—highlighting exactly what you’re permitting and flagging
              suspicious behavior. Official marketplaces like OpenSea, Uniswap,
              and Blur are allowlisted, so your normal transactions won’t be
              interrupted. But when danger lurks, the extension brings it to
              your attention before you sign.
            </p>
          </div>
        </div>
      </section>

      {/* The Paddleboard */}
      <section className="py-[75px] px-[3%] max-w-[1200px] mx-auto bg-[#cedcf8]">
        <h2 className="text-5xl font-bold text-[#1d2023] mb-8 text-left">
          The Paddleboard
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-lg">
            <thead>
              <tr>
                <th className="p-4 text-left font-bold">Rank</th>
                <th className="p-4 text-left font-bold">Bidder</th>
                <th className="p-4 text-left font-bold">Bid (USD)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="mb-4">
                  <td className="p-4 align-middle">{r.rank}</td>
                  <td className="p-4 align-middle">{r.bidder}</td>
                  <td className="p-4 align-middle">${r.bid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-left">
          <p className="text-lg text-[#222222] mb-2">
            This dashboard is updated every 1 minute.
          </p>
          <p className="text-lg text-[#222222] mb-2">
            Get new bid alerts on{' '}
            <a
              href="https://t.me/+OokpsnnL_d81MGQ1"
              target="_blank"
              className="underline"
            >
              Telegram
            </a>
            .
          </p>
          <p className="text-lg text-[#222222]">
            See all transactions in real time{' '}
            <a
              href="https://etherscan.io/address/0x1EA385183A888D7a6c9B932440EF2F534534Ea2C#multichain-portfolio"
              target="_blank"
              className="underline"
            >
              onchain
            </a>
            .
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className="py-[75px] px-[3%] max-w-[1200px] mx-auto">
        <h2 className="text-5xl font-bold text-[#1d2023] mb-8 text-left">
          Rules
        </h2>
        <div className="grid grid-cols-1 gap-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">Open</h3>
            <p className="text-lg text-[#222222]">
              All bids are publicly visible at all times. Check The Paddleboard
              and onchain to see the bids.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">All Pay</h3>
            <p className="text-lg text-[#222222]">
              Bidders place their bid(s) by paying the bid amount. Bidders pay
              regardless of whether or not they win the prize. (This differs
              from traditional auctions, in which only the winner pays.) No
              refunds.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">
              yodl Link
            </h3>
            <p className="text-lg text-[#222222]">
              All bids MUST be placed via the yodl link accessible from the "BID
              NOW" button above.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">
              Minimum Bid & Increments
            </h3>
            <p className="text-lg text-[#222222]">
              The minimum bid is $1. All bids must be at least $1 higher than
              then previous high bid.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">Top Ups</h3>
            <p className="text-lg text-[#222222]">
              You may top up your bid by making an additional payment from the
              same address.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">
              End Date & Time
            </h3>
            <p className="text-lg text-[#222222] mb-2">
              The auction will end on Tuesday, 5 August 2025 at 7:15 GMT | 15:15
              GMT+8 - or at the end of Popcorn Bidding.
            </p>
            <p className="text-lg text-[#50555c]">
              Tune in for the popcorn bidding video livestream at 7:00 GMT |
              15:00 GMT+8 on{' '}
              <a
                href="https://x.com/PaddleBattles"
                target="_blank"
                className="text-[#5b8ae6] font-bold underline"
              >
                Paddle Battle's X/Twitter
              </a>
              .
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-[#222222] mb-2">
              Popcorn Bidding
            </h3>
            <p className="text-lg text-[#222222] mb-2">
              If one or more bid is placed in the final 5 minutes, then the
              auction will be extended for an additional 5 minutes.
            </p>
            <p className="text-lg text-[#222222]">
              This will continue until there is no bid in the final 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-[3%] max-w-[1200px] mx-auto border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <Image
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/18559109/173637_954355.png"
              alt="Paddle Battle Logo"
              width={150}
              height={65}
              className="mb-2"
            />
            <p className="text-lg text-black">
              Crypto auction platform for funding charities & impactful projects
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="text-left">
              <p className="text-lg text-white mb-2">
                www.paddlebattle.auction/co
              </p>
            </div>
            <div className="text-left">
              <p className="text-lg text-[#50555c] mb-2">
                <a
                  href="https://www.paddlebattle.auction/terms"
                  target="_blank"
                  className="underline"
                >
                  Terms & Conditions
                </a>
              </p>
              <p className="text-lg text-[#50555c] mb-2">
                <a
                  href="http://www.paddlebattle.auction/privacy-policy"
                  target="_blank"
                  className="underline"
                >
                  Privacy Policy
                </a>
              </p>
              <p className="text-lg text-[#50555c]">
                <a
                  href="http://www.paddlebattle.auction/imprint"
                  target="_blank"
                  className="underline"
                >
                  Imprint
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="text-center text-lg text-[#50555c] border-t border-gray-300 pt-4">
          Made with <span className="text-[#1f1f1f]">♡</span> by brainbot gmbh
        </div>
      </footer>
    </main>
  )
}
