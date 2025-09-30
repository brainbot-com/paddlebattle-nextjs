'use client'

type FooterProps = {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <div className={`${className} text-center text-sm text-gray-500`}>
      <p>
        <a
          href="https://www.paddlebattle.auction"
          target="_blank"
          rel="noopener noreferrer"
        >
          Paddle Battle
        </a>{' '}
        - Powered by{' '}
        <a
          href="https://www.shutter.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shutter
        </a>
      </p>
    </div>
  )
}
