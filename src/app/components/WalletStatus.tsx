'use client'

import { LogOut, Wallet as WalletIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectWalletModal } from './ConnectWalletModal'

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isConnected) setIsModalOpen(false)
  }, [isConnected])

  if (!isConnected || !address) {
    return (
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm bg-[#f02a0b] text-white rounded-md transition-colors"
        >
          <WalletIcon className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
        <ConnectWalletModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Connect Your Wallet"
        />
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <WalletIcon className="w-4 h-4 text-green-600" />
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
