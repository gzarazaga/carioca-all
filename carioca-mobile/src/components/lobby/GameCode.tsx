import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import * as Clipboard from 'expo-clipboard'

interface Props {
  partidaId: string
}

export default function GameCode({ partidaId }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await Clipboard.setStringAsync(partidaId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <View className="bg-green-800/60 rounded-lg p-4 items-center">
      <Text className="text-sm text-green-300 mb-2">Codigo de partida</Text>
      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-2xl font-mono font-bold text-white bg-green-700/60 px-4 py-2 rounded tracking-wider">
          {partidaId}
        </Text>
        <Pressable onPress={copy} className="px-3 py-2 bg-blue-600 active:bg-blue-700 rounded-lg">
          <Text className="text-sm text-white">{copied ? 'Copiado!' : 'Copiar'}</Text>
        </Pressable>
      </View>
      <Text className="text-xs text-green-400 mt-2 text-center">
        Comparte este codigo para que otros se unan
      </Text>
    </View>
  )
}
