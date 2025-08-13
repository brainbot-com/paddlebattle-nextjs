import { Gavel, Heart, Shield } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface ProductInfoProps {
  rows: {
    rank: string
    bidder: string
    bid: string
  }[]
  auctionEndTime: string
}

export function ProductInfo({ rows, auctionEndTime }: ProductInfoProps) {
  return (
    <div className="space-y-12">
      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg shadow-md"
      >
        <AccordionItem value="product">
          <AccordionTrigger className="px-6 py-4">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Product Details
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-700">
            <p className="mb-4">
              <strong>
                The highest bidder will receive an imKey Pro hardware wallet, a
                high-security cold wallet developed by imToken, a leading Web3
                wallet provider trusted by millions worldwide. As a bonus, this
                listing also includes a limited-edition Dragon Zodiac figurine,
                a commemorative gift item designed by the imKey team.
              </strong>
            </p>
            <p className="mb-2">
              🔐 <strong>imKey Pro Hardware Wallet</strong>
            </p>
            <ul className="list-disc list-inside mb-4">
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
            <p className="mb-2">
              🎁 <strong>Bonus Gift – Dragon Zodiac Figurine</strong>
            </p>
            <p className="mb-4">
              As a token of appreciation, this auction includes a special
              edition Dragon Zodiac figurine, created by imKey to celebrate the
              Year of the Dragon. This collectible is not for sale elsewhere and
              is available only as a limited-time gift.
            </p>
            <p className="mb-2">
              🎉 <strong>Participation Prize:</strong>
            </p>
            <p>All bidders receive a 20% discount code for imKey products.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="impact">
          <AccordionTrigger className="px-6 py-4">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Impactful Project
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-700">
            <p className="mb-4">
              <strong>
                Revoke.cash puts the power back in your hands — reclaim control
                of every approval living in your wallet.
              </strong>
            </p>
            <p className="mb-4">
              When you connect (or even just enter your address), it inspects
              permissions across more than 100 EVM‑compatible networks. You see
              exactly which smart contracts have unrestricted “infinite” access
              to your tokens and NFTs. With just a few clicks you can revoke or
              refine those permissions — effectively cutting off any unwanted
              spending power.
            </p>
            <p className="mb-4">
              Revoke.cash isn’t just a reactive tool — use it proactively.
              Develop good wallet hygiene by periodically sweeping approvals,
              especially after using marketplaces or swapping tokens. Doing so
              reduces risk from phishing schemes and exploits. And if you ever
              fall victim to a scam, revoke the suspect approvals immediately to
              stop further losses.
            </p>
            <p>
              For enhanced security, install the Revoke.cash browser extension.
              It warns you in real time if you’re about to sign a token
              approval—highlighting exactly what you’re permitting and flagging
              suspicious behavior. Official marketplaces like OpenSea, Uniswap,
              and Blur are allowlisted, so your normal transactions won’t be
              interrupted. But when danger lurks, the extension brings it to
              your attention before you sign.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rules">
          <AccordionTrigger className="px-6 py-4">
            <Gavel className="w-5 h-5 mr-2 text-purple-500" />
            Auction Rules
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-700">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Open</h4>
                <p>
                  All bids are publicly visible at all times. Check The
                  Paddleboard and onchain to see the bids.
                </p>
              </div>
              <div>
                <h4 className="font-bold">All Pay</h4>
                <p>
                  Bidders place their bid(s) by paying the bid amount. Bidders
                  pay regardless of whether or not they win the prize. (This
                  differs from traditional auctions, in which only the winner
                  pays.) No refunds.
                </p>
              </div>
              <div>
                <h4 className="font-bold">yodl Link</h4>
                <p>
                  All bids MUST be placed via the yodl link accessible from the
                  "BID NOW" button above.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Minimum Bid & Increments</h4>
                <p>
                  The minimum bid is $1. All bids must be at least $1 higher
                  than then previous high bid.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Top Ups</h4>
                <p>
                  You may top up your bid by making an additional payment from
                  the same address.
                </p>
              </div>
              <div>
                <h4 className="font-bold">End Date & Time</h4>
                <p>
                  The auction will end on Tuesday, 5 August 2025 at 7:15 GMT |
                  15:15 GMT+8 - or at the end of Popcorn Bidding.
                </p>
                <p>
                  Tune in for the popcorn bidding video livestream at 7:00 GMT |
                  15:00 GMT+8 on Paddle Battle's X/Twitter.
                </p>
              </div>
              <div>
                <h4 className="font-bold">Popcorn Bidding</h4>
                <p>
                  If one or more bid is placed in the final 5 minutes, then the
                  auction will be extended for an additional 5 minutes. This
                  will continue until there is no bid in the final 5 minutes.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Bidder</TableHead>
              <TableHead>Bid (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.bidder}</TableCell>
                <TableCell>${row.bid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-gray-500">
          Auction ends: {auctionEndTime}
        </p>
      </div>
    </div>
  )
}
