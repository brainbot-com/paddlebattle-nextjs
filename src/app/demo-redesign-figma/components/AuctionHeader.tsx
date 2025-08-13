import { Clock, Gavel, User } from "lucide-react";
import { Button } from "./ui/button";

export function AuctionHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold">PaddleBattle</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Auctions</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-mono">02:14:33</span>
            </div>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}