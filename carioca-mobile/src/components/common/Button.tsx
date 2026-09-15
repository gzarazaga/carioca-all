import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, gradients, fonts } from '../../theme'

type Variant = 'primary' | 'success' | 'danger' | 'warning' | 'accent' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  variant?: Variant
  size?: Size
  bold?: boolean
  style?: StyleProp<ViewStyle>
  children: string
}

const GRADIENT_VARIANTS: Variant[] = ['primary', 'danger', 'warning', 'accent']

const SIZE = {
  sm: { paddingVertical: 11, paddingHorizontal: 14, fontSize: 13, minHeight: 44, radius: 12 },
  md: { paddingVertical: 13, paddingHorizontal: 16, fontSize: 14, minHeight: 46, radius: 14 },
  lg: { paddingVertical: 15, paddingHorizontal: 18, fontSize: 16, minHeight: 50, radius: 14 },
}

const OUTLINE_BG: Record<string, string> = {
  success: 'rgba(0,200,209,0.10)',
  neutral: 'rgba(83,84,97,0.35)',
}
const OUTLINE_BORDER: Record<string, string> = {
  success: colors.success[600],
  neutral: 'rgba(83,84,97,0.6)',
}
const TEXT_COLOR: Record<Variant, string> = {
  primary: '#fff',
  danger: '#fff',
  accent: '#fff',
  warning: colors.felt[900],
  success: colors.success[400],
  neutral: colors.felt[300],
}
const GLOW: Record<string, string> = {
  primary: colors.primary[600],
  danger: colors.danger[600],
  warning: colors.warning[500],
  accent: colors.accent[600],
}

export default function Button({
  variant = 'primary',
  size = 'md',
  bold = true,
  disabled,
  style,
  children,
  ...rest
}: Props) {
  const s = SIZE[size]
  const isGradient = GRADIENT_VARIANTS.includes(variant)
  const fontFamily = bold ? fonts.displaySemibold : fonts.displayMedium

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: s.radius,
          minHeight: s.minHeight,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
        !isGradient && {
          backgroundColor: OUTLINE_BG[variant],
          borderWidth: 1.5,
          borderColor: OUTLINE_BORDER[variant],
        },
        isGradient && {
          shadowColor: GLOW[variant],
          shadowOpacity: 0.55,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        },
        style,
      ]}
      {...rest}
    >
      {isGradient && (
        <LinearGradient
          colors={gradients[variant as keyof typeof gradients]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
      <View style={{ paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal }}>
        <Text style={{ fontFamily, fontSize: s.fontSize, color: TEXT_COLOR[variant], textAlign: 'center', letterSpacing: 0.2 }}>
          {children}
        </Text>
      </View>
    </Pressable>
  )
}
