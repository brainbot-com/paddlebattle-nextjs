import { BarChart3, FileText, Package, Shield, Trophy } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function ProductInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-4">
          ImKey Pro Hardware Wallet + Dragon Zodiac Figurine
        </h1>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary">Hardware Wallet</Badge>
          <Badge variant="secondary">Collectible</Badge>
          <Badge variant="secondary">Limited Edition</Badge>
          <Badge className="bg-green-50 text-green-700">
            Verified Authentic
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-300">
          <TabsTrigger value="description" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Prize
          </TabsTrigger>
          <TabsTrigger value="project" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Project
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Prize Details</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                This exclusive auction features the innovative ImKey Pro
                Hardware Wallet paired with a beautifully crafted Dragon Zodiac
                Figurine. The ImKey Pro represents the pinnacle of
                cryptocurrency security technology, offering unparalleled
                protection for your digital assets.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-4">
                What's Included:
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• ImKey Pro Hardware Wallet with secure chip technology</li>
                <li>• Dragon Zodiac Figurine (Limited Edition, #247/500)</li>
                <li>• Original packaging and documentation</li>
                <li>• Certificate of authenticity from imKey</li>
                <li>• Quick start guide and warranty information</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-4">
                Technical Specifications:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <strong>Security:</strong> CC EAL 6+ certified chip
                  </div>
                  <div>
                    <strong>Connectivity:</strong> Bluetooth 4.0
                  </div>
                  <div>
                    <strong>Compatibility:</strong> iOS, Android, Windows, macOS
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <strong>Supported Coins:</strong> 10,000+ cryptocurrencies
                  </div>
                  <div>
                    <strong>Battery:</strong> Rechargeable, 2-week standby
                  </div>
                  <div>
                    <strong>Dimensions:</strong> 39mm × 39mm × 6.8mm
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Impactful Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This auction supports blockchain education initiatives
                worldwide. A portion of the proceeds will be donated to
                cryptocurrency literacy programs in developing countries.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Impact Goals:
                </h4>
                <ul className="text-blue-800 space-y-1">
                  <li>
                    • Fund 10 blockchain workshops in underserved communities
                  </li>
                  <li>• Provide educational materials to 500+ students</li>
                  <li>• Support local crypto entrepreneurs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>The Paddleboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, bidder: 'CryptoEnthusiast92', bid: 419, bids: 8 },
                  { rank: 2, bidder: 'BlockchainPro', bid: 409, bids: 5 },
                  { rank: 3, bidder: 'WalletCollector', bid: 399, bids: 3 },
                  { rank: 4, bidder: 'TechSavvy2024', bid: 389, bids: 2 },
                  { rank: 5, bidder: 'DigitalNomad', bid: 379, bids: 4 },
                ].map(entry => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          entry.rank === 1
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.rank === 2
                              ? 'bg-gray-100 text-gray-800'
                              : entry.rank === 3
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        #{entry.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{entry.bidder}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.bids} bids
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold">${entry.bid}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Auction Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Bidding</h4>
                <p className="text-muted-foreground text-sm">
                  All bids are binding. Minimum bid increment is $10. Bids
                  placed in the final 5 minutes will extend the auction by 5
                  minutes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Payment</h4>
                <p className="text-muted-foreground text-sm">
                  Payment is due within 48 hours of auction end. We accept major
                  credit cards, PayPal, and cryptocurrency payments.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Shipping</h4>
                <p className="text-muted-foreground text-sm">
                  Items will be shipped within 3-5 business days via insured
                  courier. International shipping available with customs
                  documentation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Authenticity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Verified Authentic</div>
                    <div className="text-sm text-muted-foreground">
                      Each item comes with certificate of authenticity
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Secure Transactions</div>
                    <div className="text-sm text-muted-foreground">
                      SSL encrypted and PCI compliant payments
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
