import { View, Text, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGameStore } from '../../stores/gameStore'

const COLORS: Record<string, string> = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  error: 'bg-red-600',
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
          className={`${COLORS[t.type]} px-4 py-2 rounded-lg flex-row items-center justify-between gap-2`}
        >
          <Text className="text-white text-sm font-medium flex-1">{t.text}</Text>
          <Pressable onPress={() => removeToast(t.id)}>
            <Text className="text-white opacity-70">✕</Text>
          </Pressable>
        </View>
      ))}
    </View>
  )
}
