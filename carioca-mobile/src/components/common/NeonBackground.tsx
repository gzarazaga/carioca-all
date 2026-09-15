import { View, type ViewStyle } from 'react-native'
import { colors } from '../../theme'

/**
 * Equivalente RN de los blobs radiales difuminados del fondo en web
 * (`blur-3xl` + `radial-gradient`). RN no tiene filter:blur sobre Views
 * arbitrarios, así que se aproxima el glow con círculos concéntricos de
 * opacidad creciente hacia el centro.
 */
function GlowBlob({ color, size, style }: { color: string; size: number; style?: ViewStyle }) {
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <View
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: size / 2, backgroundColor: color, opacity: 0.1,
        }}
      />
      <View
        style={{
          position: 'absolute', top: size * 0.15, left: size * 0.15, right: size * 0.15, bottom: size * 0.15,
          borderRadius: (size * 0.7) / 2, backgroundColor: color, opacity: 0.18,
        }}
      />
      <View
        style={{
          position: 'absolute', top: size * 0.34, left: size * 0.34, right: size * 0.34, bottom: size * 0.34,
          borderRadius: (size * 0.32) / 2, backgroundColor: color, opacity: 0.26,
        }}
      />
    </View>
  )
}

interface Props {
  variant?: 'success' | 'warning'
}

export default function NeonBackground({ variant = 'success' }: Props) {
  const secondary = variant === 'warning' ? colors.warning[500] : colors.success[600]
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <GlowBlob color={colors.primary[600]} size={340} style={{ position: 'absolute', top: -140, left: -120 }} />
      <GlowBlob color={secondary} size={360} style={{ position: 'absolute', bottom: -150, right: -130 }} />
    </View>
  )
}
