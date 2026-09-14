import type { Carta } from '../../types/game'
import { getSuitSymbol, getSuitColor, getValueDisplay, isJoker } from '../../utils/cardHelpers'

interface Props {
  carta: Carta
  selected?: boolean
  onClick?: () => void
  small?: boolean
}

export default function Card({ carta, selected, onClick, small }: Props) {
  const value = getValueDisplay(carta.valor)
  const suit = getSuitSymbol(carta.palo)
  const color = getSuitColor(carta.palo)
  const joker = isJoker(carta.valor)

  const size = small ? 'w-12 h-18 text-xs' : 'w-16 h-24 text-sm'

  return (
    <div
      onClick={onClick}
      className={`
        ${size} rounded-xl bg-gradient-to-br from-white to-neutral-100 border-2 flex flex-col items-center justify-between
        p-1.5 cursor-pointer transition-all duration-200 ease-out card-shadow select-none relative overflow-hidden
        ${selected ? 'card-selected border-primary-400' : 'border-neutral-300 hover:border-neutral-400'}
        ${onClick ? 'hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg' : ''}
      `}
    >
      {joker ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-primary-400/30 blur-md" />
          <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="Comodin"
            className={`${small ? 'w-5 h-5' : 'w-7 h-7'} absolute drop-shadow-sm`}
          >
            <path
              d="M12 1 L14.6 8.6 L22 11 L14.6 13.4 L12 21 L9.4 13.4 L2 11 L9.4 8.6 Z"
              className="fill-warning-500"
            />
          </svg>
        </div>
      ) : (
        <>
          <div className={`self-start font-bold leading-none tracking-tight ${color}`}>
            {value}
          </div>
          <div className={`text-2xl ${small ? 'text-lg' : ''} ${color} drop-shadow-sm relative`}>
            {suit}
          </div>
          <div className={`self-end font-bold leading-none tracking-tight rotate-180 ${color}`}>
            {value}
          </div>
        </>
      )}
    </div>
  )
}
