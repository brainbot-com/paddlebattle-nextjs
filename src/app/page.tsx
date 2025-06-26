'use client'

import { useAccount } from 'wagmi'
import { ConnectWallet } from './components/ConnectWallet'
import { SealedBidForm } from './components/SealedBidForm'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sealed Bid Auction
          </h1>
          <p className="text-gray-600">
            Submit your encrypted bid using Shutter Network
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {!isConnected ? (
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
          ) : (
            <SealedBidForm />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Shutter Network • Privacy-preserving sealed bids</p>
        </div>
      </div>
    </main>
  )
}
