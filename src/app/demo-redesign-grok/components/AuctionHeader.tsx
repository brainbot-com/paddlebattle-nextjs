import { Flame, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export function AuctionHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-indigo-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold">PaddleBattle</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-yellow-300">
              Auctions
            </a>
            <a href="#" className="hover:text-yellow-300">
              How It Works
            </a>
            <a href="#" className="hover:text-yellow-300">
              Support
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-white">
              Connect
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-indigo-900">
              Create
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-indigo-800">
            {/* Mobile menu */}
          </div>
        )}
      </div>
    </header>
  )
}
