import { createConfig, http } from 'wagmi'
import { gnosis, mainnet, sepolia } from 'wagmi/chains'
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from 'wagmi/connectors'

// Get project ID from environment variables or use a default
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [gnosis, mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'Sealed Bid Auction',
      appLogoUrl: '/favicon.ico',
    }),
    ...(projectId !== 'YOUR_PROJECT_ID' ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [gnosis.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
