import { useState } from 'react'
import { Text, View } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import GlassPanel from '../common/GlassPanel'
import Button from '../common/Button'

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
    <GlassPanel>
      <View className="p-5 items-center">
        <Text className="text-[11px] uppercase tracking-wider text-felt-300 mb-2.5">Código de partida</Text>
        <View className="flex-row items-center justify-center gap-2.5">
          <Text className="text-2xl font-mono font-body-bold bg-felt-900 border border-felt-600 text-success-400 px-4 py-2.5 rounded-xl tracking-wider">
            {partidaId}
          </Text>
          <Button onPress={copy} variant="success" size="md" bold={false}>
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        </View>
        <Text className="text-[11px] text-felt-400 mt-2.5 text-center">
          Comparte este código para que otros se unan
        </Text>
      </View>
    </GlassPanel>
  )
}
