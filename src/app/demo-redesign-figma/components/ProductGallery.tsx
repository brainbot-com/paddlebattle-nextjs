'use client'

import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { useState } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Button } from './ui/button'

export function ProductGallery() {
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/23171_935220.png',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&crop=center',
  ]

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
        <ImageWithFallback
          src={images[currentImage]}
          alt="ImKey Pro Hardware Wallet"
          className="w-full h-full object-cover"
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
        >
          <Expand className="w-5 h-5" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              index === currentImage ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <ImageWithFallback
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
