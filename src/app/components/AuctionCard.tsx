'use client'

import { ArrowRight, Clock, Trophy } from 'lucide-react'
import Link from 'next/link'
import type { Auction } from '../utils/api'
import { truncateOrEns } from '../utils/helpers'

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export function AuctionCard({ auction }: { auction: Auction }) {
  const isEnded = new Date(auction.expirationTime).getTime() <= Date.now()
  const href = isEnded ? `/${auction.slug}/result` : `/${auction.slug}/bidForm`
  const winner = auction.winnerWalletAddress
    ? truncateOrEns(auction.winnerWalletAddress, {})
    : 'TBD'

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
            {auction.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">/{auction.slug}</p>
        </div>
        <span
          className={
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ' +
            (isEnded
              ? 'bg-gray-100 text-gray-700'
              : 'bg-green-100 text-green-700')
          }
        >
          {isEnded ? (
            <>
              <Trophy className="h-3.5 w-3.5" /> Ended
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5" /> Running
            </>
          )}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500">{isEnded ? 'Ended at' : 'Ends at'}</p>
          <p className="font-medium text-gray-900">
            {formatDateTime(auction.expirationTime)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500">{isEnded ? 'Winner' : 'Type'}</p>
          <p className="font-medium text-gray-900 capitalize">
            {isEnded ? winner : auction.type}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 text-sm font-medium text-blue-700">
        <span>{isEnded ? 'View results' : 'Place a sealed bid'}</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

export default AuctionCard
