import { TrendingUp, Users, Shield, Award } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function BiddingInterface() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Current Highest Bid</CardTitle>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-semibold text-primary mb-2">$419</div>
            <div className="text-muted-foreground">
              <Users className="w-4 h-4 inline mr-1" />
              28 bids • 14 bidders
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Fast Bid $439
            </Button>
            <Button size="lg" variant="outline">
              Custom Bid
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Next minimum bid: $429
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Auction Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Starting Bid</div>
              <div className="font-semibold">$50</div>
            </div>
            <div>
              <div className="text-muted-foreground">Bid Increment</div>
              <div className="font-semibold">$10</div>
            </div>
            <div>
              <div className="text-muted-foreground">Time Left</div>
              <div className="font-semibold text-red-600">2h 14m 33s</div>
            </div>
            <div>
              <div className="text-muted-foreground">Ends</div>
              <div className="font-semibold">Aug 13, 3:30 PM</div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Award className="w-4 h-4" />
              Winner Benefits
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Free shipping worldwide</li>
              <li>• Certificate of authenticity</li>
              <li>• 30-day return policy</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
