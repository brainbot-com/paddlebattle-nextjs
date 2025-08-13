// Figma

import { AuctionHeader } from './components/AuctionHeader'
import { BiddingInterface } from './components/BiddingInterface'
import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'

import './styles/globals.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuctionHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Gallery - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            <ProductGallery />
            <ProductInfo />
          </div>

          {/* Bidding Interface - Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BiddingInterface />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">PaddleBattle</h3>
              <p className="text-sm text-muted-foreground">
                Premier online auction house for technology and collectibles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Auctions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Current Auctions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Upcoming
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Past Results
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PaddleBattle Auction House. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
