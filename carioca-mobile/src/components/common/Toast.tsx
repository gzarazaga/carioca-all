import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGameStore } from '../../stores/gameStore'

const COLORS: Record<string, string> = {
  info: 'bg-primary-600',
  success: 'bg-success-700',
  error: 'bg-danger-600',
}

export default function Toast() {
  const toasts = useGameStore((s) => s.toasts)
  const removeToast = useGameStore((s) => s.removeToast)
  const insets = useSafeAreaInsets()

  if (toasts.length === 0) return null

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-4 right-4 z-50 gap-2"
      style={{ top: insets.top + 8 }}
    >
      {toasts.map((t) => (
        <View
          key={t.id}
          className={`${COLORS[t.type]} px-4 py-3 rounded-xl flex-row items-center justify-between gap-2`}
        >
          <Text className="text-white text-sm font-body-medium flex-1">{t.text}</Text>
          <Pressable onPress={() => removeToast(t.id)} hitSlop={8}>
            <Text className="text-white opacity-70">✕</Text>
          </Pressable>
        </View>
      ))}
    </View>
  )
}
