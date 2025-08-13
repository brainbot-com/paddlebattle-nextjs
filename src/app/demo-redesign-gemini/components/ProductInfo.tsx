import { Gavel, Heart, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function ProductInfo() {
  return (
    <div className="mt-8">
      <Tabs defaultValue="product" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="product">
            <Shield className="w-4 h-4 mr-2" />
            Product Details
          </TabsTrigger>
          <TabsTrigger value="impact">
            <Heart className="w-4 h-4 mr-2" />
            Impact
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Gavel className="w-4 h-4 mr-2" />
            Auction Rules
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="product"
          className="mt-4 p-6 bg-white rounded-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            About the Prize
          </h3>
          <p className="text-gray-600 mb-4">
            The highest bidder will receive an imKey Pro hardware wallet, a
            high-security cold wallet from imToken, and a limited-edition Dragon
            Zodiac figurine.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>CC EAL6+ Certified Secure Chip for ultimate protection.</li>
            <li>
              Supports over 11 major blockchains including Bitcoin and Ethereum.
            </li>
            <li>Seamlessly stake your ETH through the imToken app.</li>
            <li>Compact, lightweight, and portable for on-the-go security.</li>
          </ul>
        </TabsContent>
        <TabsContent
          value="impact"
          className="mt-4 p-6 bg-white rounded-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Supporting a Great Cause
          </h3>
          <p className="text-gray-600">
            80% of the auction proceeds will be donated to Revoke.cash, a vital
            public good that helps users manage their token approvals and stay
            safe in the world of DeFi. Your bid helps keep this essential
            service running.
          </p>
        </TabsContent>
        <TabsContent
          value="rules"
          className="mt-4 p-6 bg-white rounded-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            How the Auction Works
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>All-Pay Auction:</strong> All bids are final and
              non-refundable, regardless of whether you win.
            </li>
            <li>
              <strong>Top-Up Bids:</strong> You can increase your bid at any
              time from the same wallet address.
            </li>
            <li>
              <strong>Popcorn Bidding:</strong> Bids placed in the last 5
              minutes will extend the auction by 5 minutes.
            </li>
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}
