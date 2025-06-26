'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { connectors, connect, isPending } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const [connectingId, setConnectingId] = useState<string | null>(null)

  if (isConnected) {
    return (
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-700 font-medium">Wallet Connected</span>
          </div>
          <p className="text-sm text-green-600 break-all">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-sm text-red-600 hover:text-red-700 underline"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {connectors.map(connector => (
        <button
          key={connector.uid}
          onClick={() => {
            setConnectingId(connector.uid)
            connect({ connector })
          }}
          disabled={isPending}
          className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium transition-colors ${
            connectingId === connector.uid || isPending
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {connectingId === connector.uid ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Connecting...
            </div>
          ) : (
            <>
              <WalletIcon name={connector.name} />
              <span className="ml-2">Connect with {connector.name}</span>
            </>
          )}
        </button>
      ))}
    </div>
  )
}

function WalletIcon({ name }: { name: string }) {
  // Simple icon based on wallet name
  if (name.toLowerCase().includes('metamask')) {
    return (
      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">M</span>
      </div>
    )
  }

  if (name.toLowerCase().includes('coinbase')) {
    return (
      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">C</span>
      </div>
    )
  }

  if (name.toLowerCase().includes('walletconnect')) {
    return (
      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">W</span>
      </div>
    )
  }

  // Default wallet icon
  return (
    <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
      <span className="text-xs text-white font-bold">W</span>
    </div>
  )
}
