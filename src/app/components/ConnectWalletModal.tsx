'use client'

import { X } from 'lucide-react'
import { ConnectWallet } from './ConnectWallet'

export function ConnectWalletModal({
  open,
  onClose,
  title = 'Connect Your Wallet',
}: {
  open: boolean
  onClose: () => void
  title?: string
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <ConnectWallet />
        </div>
      </div>
    </div>
  )
}
