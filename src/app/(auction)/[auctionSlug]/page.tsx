'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LegacyAuctionRouteRedirect() {
  const { auctionSlug } = useParams<{ auctionSlug: string }>()
  const router = useRouter()

  useEffect(() => {
    if (auctionSlug) {
      router.replace(`/${auctionSlug}/bidForm`)
    }
  }, [auctionSlug, router])

  return null
}
