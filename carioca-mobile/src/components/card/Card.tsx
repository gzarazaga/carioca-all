import { View, Text, Pressable } from 'react-native'
import type { Carta } from '../../types/game'
import { getSuitSymbol, getSuitColor, getValueDisplay, isJoker } from '../../utils/cardHelpers'

interface Props {
  carta: Carta
  selected?: boolean
  onPress?: () => void
  small?: boolean
}

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
}

export default function Card({ carta, selected, onPress, small }: Props) {
  const value = getValueDisplay(carta.valor)
  const suit = getSuitSymbol(carta.palo)
  const color = getSuitColor(carta.palo)
  const joker = isJoker(carta.valor)

  const size = small ? 'w-12 h-[72px]' : 'w-16 h-24'

  return (
    <Pressable
      onPress={onPress}
      className={`
        ${size} rounded-lg bg-white border-2 items-center justify-between
        p-1
        ${selected ? 'border-blue-400' : 'border-gray-300'}
      `}
      style={[
        CARD_SHADOW,
        selected ? { transform: [{ translateY: -12 }] } : null,
      ]}
    >
      <Text className={`self-start font-bold ${small ? 'text-xs' : 'text-sm'} ${color}`}>
        {value}
      </Text>
      <Text className={`${small ? 'text-lg' : 'text-2xl'} ${color}`}>
        {joker ? '🃏' : suit}
      </Text>
      <Text className={`self-end font-bold rotate-180 ${small ? 'text-xs' : 'text-sm'} ${color}`}>
        {value}
      </Text>
    </Pressable>
  )
}
