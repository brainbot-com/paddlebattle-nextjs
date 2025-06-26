'use client'

import { LogOut, Wallet } from 'lucide-react'
import { useAccount, useDisconnect } from 'wagmi'

export function WalletStatus() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (!isConnected || !address) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Wallet Connected</p>
          <p className="text-xs text-gray-500 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      </div>
      <button
        onClick={() => disconnect()}
        className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Disconnect wallet"
      >
        <LogOut className="w-3 h-3" />
        <span>Disconnect</span>
      </button>
    </div>
  )
}
