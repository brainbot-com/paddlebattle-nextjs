import { Clock, Rocket, ShieldCheck, Tag, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface BiddingInterfaceProps {
  highestBid: string
  totalRaised: string
  auctionEndTime: string
  // add more props as needed
}

export function BiddingInterface({
  highestBid,
  totalRaised,
  auctionEndTime,
}: BiddingInterfaceProps) {
  // Add logic
  const isEnded = new Date(auctionEndTime) < new Date()
  // Compute countdown (simplified)
  const timeLeft = 'Calculated time left' // Implement properly

  return (
    <Card className="shadow-xl border-0 bg-white/90">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">
            Place Your Bid
          </CardTitle>
          <Badge
            variant="secondary"
            className={
              isEnded
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }
          >
            <Zap className="w-4 h-4 mr-1" />
            {isEnded ? 'Ended' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <p className="text-sm font-medium text-gray-600">
            Current Highest Bid
          </p>
          <p className="text-4xl font-bold text-indigo-600 tracking-tight">
            ${highestBid}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Total Raised: ${totalRaised}
          </p>
        </div>

        {/* Add countdown */}
        <div className="flex justify-center items-center space-x-2 text-gray-700">
          <Clock className="w-5 h-5" />
          <p>
            {isEnded ? `Ended on: ${auctionEndTime}` : `Ends in: ${timeLeft}`}
          </p>
        </div>

        <div className="space-y-3">
          {isEnded ? (
            <Button
              size="lg"
              disabled
              className="w-full bg-gray-400 text-white"
            >
              CLOSED
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Bid Now
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            <Tag className="w-5 h-5 mr-2" />
            Custom Amount
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
          <p className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
            Secure bidding powered by blockchain
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
