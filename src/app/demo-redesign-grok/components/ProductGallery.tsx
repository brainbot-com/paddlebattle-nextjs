import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

const images = [
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/23171_935220.png',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/506583_673122.png',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/54602_550056.png',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/608601_96075.png',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/18559109/157891_920055.png',
]

export function ProductGallery() {
  return (
    <Carousel className="w-full h-full">
      <CarouselContent className="h-full">
        {images.map((src, index) => (
          <CarouselItem key={index} className="h-full">
            <Image
              src={src}
              alt={`Product ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              className="brightness-75"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  )
}
