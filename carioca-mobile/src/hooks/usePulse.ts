import { useEffect } from 'react'
import { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

/**
 * Equivalente RN de la animación CSS ".pulse-amber" (web): un glow que
 * respira via shadowOpacity/shadowRadius mientras `active` es true.
 * Combinar con shadowColor: colors.warning[500] en el estilo del View.
 */
export function usePulse(active: boolean) {
  const pulse = useSharedValue(0)

  useEffect(() => {
    pulse.value = active
      ? withRepeat(withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true)
      : withTiming(0, { duration: 200 })
  }, [active, pulse])

  return useAnimatedStyle(() => ({
    shadowOpacity: 0.15 + pulse.value * 0.35,
    shadowRadius: 4 + pulse.value * 10,
  }))
}
