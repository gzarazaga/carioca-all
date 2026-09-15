import { View, StyleSheet, type ViewProps } from 'react-native'
import { BlurView } from 'expo-blur'

/**
 * Equivalente RN de ".glass-panel" (web): superficie translúcida con blur.
 * Solo provee la superficie — el padding/gap de contenido lo define quien
 * la use, envolviendo su contenido en un View propio.
 */
export default function GlassPanel({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.base, style]} {...rest}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(161,140,220,0.35)',
  },
  tint: {
    backgroundColor: 'rgba(20,21,32,0.55)',
  },
})
