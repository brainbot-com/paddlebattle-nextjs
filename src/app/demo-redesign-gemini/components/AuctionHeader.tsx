import { Flame, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export function AuctionHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <Flame className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">PaddleBattle</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300"
            >
              Auctions
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300"
            >
              How It Works
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-red-500 transition-colors duration-300"
            >
              Support
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Connect Wallet
            </Button>
            <Button className="hidden sm:inline-flex bg-red-500 hover:bg-red-600">
              Create Auction
            </Button>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors duration-300"
              >
                Auctions
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors duration-300"
              >
                How It Works
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors duration-300"
              >
                Support
              </a>
            </nav>
            <div className="flex flex-col space-y-4">
              <Button variant="outline">Connect Wallet</Button>
              <Button className="bg-red-500 hover:bg-red-600">
                Create Auction
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
