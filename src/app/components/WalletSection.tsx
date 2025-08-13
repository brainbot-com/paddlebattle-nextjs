'use client'

import { useAccount } from 'wagmi'
import type { Auction } from '../utils/api'
import { ConnectWallet } from './ConnectWallet'
import { SealedBidForm } from './SealedBidForm'
import { WalletStatus } from './WalletStatus'

export default function WalletSection({ auction }: { auction?: Auction }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to participate in the sealed bid auction
          </p>
        </div>
        <ConnectWallet />
      </div>
    )
  }

  return <SealedBidForm auction={auction} />
}

// Export WalletStatus for use in the main page layout
export { WalletStatus }
