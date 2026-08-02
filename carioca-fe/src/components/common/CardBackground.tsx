import type { CSSProperties } from 'react'

interface DecorCard {
  top: string
  left: string
  rotate: number
  size: number
  duration: string
  delay: string
  pattern: boolean
}

const CARDS: DecorCard[] = [
  { top: '6%', left: '8%', rotate: -18, size: 90, duration: '9s', delay: '0s', pattern: true },
  { top: '65%', left: '4%', rotate: 12, size: 70, duration: '11s', delay: '1.2s', pattern: false },
  { top: '10%', left: '82%', rotate: 15, size: 80, duration: '10s', delay: '0.6s', pattern: false },
  { top: '70%', left: '85%', rotate: -10, size: 95, duration: '8s', delay: '2s', pattern: true },
  { top: '38%', left: '92%', rotate: 25, size: 55, duration: '7s', delay: '0.3s', pattern: false },
  { top: '85%', left: '48%', rotate: -8, size: 60, duration: '9.5s', delay: '1.6s', pattern: true },
]

const GLYPHS = ['♠', '♥', '♦', '♣']

function cardStyle(card: DecorCard): CSSProperties {
  return {
    top: card.top,
    left: card.left,
    width: card.size,
    height: card.size * 1.5,
    opacity: 0.16,
    animationDuration: card.duration,
    animationDelay: card.delay,
    transform: `rotate(${card.rotate}deg)`,
    ['--rot' as string]: `${card.rotate}deg`,
  } as CSSProperties
}

export default function CardBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {CARDS.map((card, i) => (
        <div
          key={i}
          className={`absolute rounded-xl animate-card-float ${
            card.pattern
              ? 'card-back-pattern border border-primary-900/50'
              : 'bg-white/10 border border-white/20'
          }`}
          style={cardStyle(card)}
        />
      ))}
      {GLYPHS.map((glyph, i) => (
        <span
          key={glyph}
          className="absolute font-bold text-white/10 animate-card-float select-none"
          style={{
            top: `${20 + i * 18}%`,
            left: i % 2 === 0 ? '18%' : '76%',
            fontSize: '4rem',
            animationDuration: `${10 + i}s`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  )
}