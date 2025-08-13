'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Geist, Geist_Mono } from 'next/font/google'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en">
      <head>
        <title>Sealed Bid Auction</title>
        <meta
          name="description"
          content="Privacy-preserving sealed bid auction using Shutter Network"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
