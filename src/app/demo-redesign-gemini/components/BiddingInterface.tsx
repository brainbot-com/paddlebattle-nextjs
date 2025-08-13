import { Rocket, ShieldCheck, Tag, Users, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function BiddingInterface() {
  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Auction Status
          </CardTitle>
          <Badge className="bg-red-100 text-red-600 border-red-200">
            <Zap className="w-4 h-4 mr-1" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500">
            Current Highest Bid
          </p>
          <p className="text-5xl font-bold text-red-500 tracking-tight">$419</p>
          <p className="text-sm text-gray-500 mt-1">
            <Users className="w-4 h-4 inline-block mr-1" />
            28 bids from 14 bidders
          </p>
        </div>

        <div className="space-y-4">
          <Button size="lg" className="w-full bg-red-500 hover:bg-red-600">
            <Rocket className="w-5 h-5 mr-2" />
            Place Quick Bid: $439
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            <Tag className="w-5 h-5 mr-2" />
            Place Custom Bid
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Next minimum bid is $429
        </div>

        <div className="pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-3">
          <p className="flex items-center">
            <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
            <span>All bids are final and non-refundable.</span>
          </p>
          <p className="flex items-center">
            <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
            <span>Winner is responsible for shipping costs.</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
