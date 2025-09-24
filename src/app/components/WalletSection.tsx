'use client'

import type { Auction } from '../utils/api'
import { SealedBidForm } from './SealedBidForm'

export default function WalletSection({ auction }: { auction?: Auction }) {
  return <SealedBidForm auction={auction} />
}
