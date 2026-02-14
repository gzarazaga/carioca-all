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
        ${size} rounded-lg bg-white border-2 flex flex-col items-center justify-between
        p-1 cursor-pointer transition-all duration-200 card-shadow select-none
        ${selected ? 'card-selected border-blue-400' : 'border-gray-300 hover:border-gray-400'}
        ${onClick ? 'hover:-translate-y-1' : ''}
      `}
    >
      <div className={`self-start font-bold ${color}`}>
        {value}
      </div>
      <div className={`text-2xl ${small ? 'text-lg' : ''} ${color}`}>
        {joker ? '🃏' : suit}
      </div>
      <div className={`self-end font-bold rotate-180 ${color}`}>
        {value}
      </div>
    </div>
  )
}
