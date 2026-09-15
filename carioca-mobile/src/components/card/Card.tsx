import { Pressable, Text, View } from 'react-native'
import type { Carta } from '../../types/game'
import { getSuitSymbol, getSuitColor, getValueDisplay, isJoker } from '../../utils/cardHelpers'
import { colors } from '../../theme'
import { SparkIcon } from '../common/icons'

interface Props {
  carta: Carta
  selected?: boolean
  onPress?: () => void
  small?: boolean
}

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.35,
  shadowRadius: 6,
  elevation: 4,
}

const SELECTED_GLOW = {
  shadowColor: colors.pink[500],
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.55,
  shadowRadius: 12,
  elevation: 10,
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
        ${size} rounded-xl bg-white border-2 items-center justify-between
        ${small ? 'p-1' : 'p-1.5'}
        ${selected ? 'border-primary-400' : 'border-neutral-300'}
      `}
      style={[
        CARD_SHADOW,
        selected ? [SELECTED_GLOW, { transform: [{ translateY: -14 }, { scale: 1.05 }] }] : null,
      ]}
    >
      {joker ? (
        <View className="absolute inset-0 items-center justify-center">
          <View
            className="absolute rounded-full"
            style={{ width: small ? 22 : 32, height: small ? 22 : 32, backgroundColor: colors.primary[400], opacity: 0.3 }}
          />
          <SparkIcon size={small ? 18 : 26} color={colors.warning[500]} />
        </View>
      ) : (
        <>
          <Text className={`self-start font-bold ${small ? 'text-[9px]' : 'text-sm'} ${color}`}>{value}</Text>
          <Text className={`${small ? 'text-lg' : 'text-2xl'} ${color}`}>{suit}</Text>
          <Text
            className={`self-end font-bold ${small ? 'text-[9px]' : 'text-sm'} ${color}`}
            style={{ transform: [{ rotate: '180deg' }] }}
          >
            {value}
          </Text>
        </>
      )}
    </Pressable>
  )
}
