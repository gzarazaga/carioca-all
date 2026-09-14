import { useId } from 'react'

interface Props {
  small?: boolean
}

export default function CardBack({ small }: Props) {
  const size = small ? 'w-12 h-18' : 'w-16 h-24'
  const patternIdA = useId()
  const patternIdB = useId()

  return (
    <div
      className={`
        ${size} rounded-xl border-2 border-primary-700
        flex items-center justify-center card-shadow select-none relative overflow-hidden
        bg-gradient-to-br from-felt-700 to-felt-900
      `}
    >
      <svg width="100%" height="100%" viewBox="0 0 64 96" preserveAspectRatio="none" className="absolute inset-0">
        <defs>
          <pattern id={patternIdA} width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="5.5" y1="0" x2="5.5" y2="11" stroke="oklch(70% 0.17 320 / 0.55)" strokeWidth="1.1" />
          </pattern>
          <pattern id={patternIdB} width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="5.5" y1="0" x2="5.5" y2="11" stroke="oklch(75% 0.14 200 / 0.4)" strokeWidth="1.1" />
          </pattern>
        </defs>
        <rect width="64" height="96" fill={`url(#${patternIdA})`} />
        <rect width="64" height="96" fill={`url(#${patternIdB})`} />
      </svg>
      <div className="absolute inset-1.5 rounded-lg border border-warning-400/40" />
      <span
        className={`${small ? 'text-base' : 'text-lg'} font-display font-bold neon-text drop-shadow relative`}
      >
        C
      </span>
    </div>
  )
}
