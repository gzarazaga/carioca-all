import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, fonts } from '../../theme'
import { CARD_SHADOW } from './Card'

interface Props {
  small?: boolean
}

export default function CardBack({ small }: Props) {
  const width = small ? 48 : 64
  const height = small ? 72 : 96

  return (
    <View
      className="rounded-xl border-2 border-primary-700 items-center justify-center overflow-hidden"
      style={[{ width, height }, CARD_SHADOW]}
    >
      <LinearGradient
        colors={[colors.felt[700], colors.felt[900]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-lg border"
        style={{ top: 6, left: 6, right: 6, bottom: 6, borderColor: 'rgba(237,180,23,0.35)' }}
      />
      <Text
        style={{
          fontFamily: fonts.displayBold,
          fontSize: small ? 16 : 18,
          color: colors.pink[500],
          textShadowColor: 'rgba(224,72,184,0.5)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        }}
      >
        C
      </Text>
    </View>
  )
}
