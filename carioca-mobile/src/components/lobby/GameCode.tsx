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
      <View className="p-5 items-center w-full">
        <Text className="text-[11px] uppercase tracking-wider text-felt-300 mb-2.5">Código de partida</Text>
        <View className="w-full bg-felt-900 border border-felt-600 rounded-xl px-4 py-3 mb-3">
          <Text className="text-base font-mono font-body-bold text-success-400 tracking-wider text-center">
            {partidaId}
          </Text>
        </View>
        <Button onPress={copy} variant="success" size="md" bold={false} style={{ alignSelf: 'stretch' }}>
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
        <Text className="text-[11px] text-felt-400 mt-2.5 text-center">
          Comparte este código para que otros se unan
        </Text>
      </View>
    </GlassPanel>
  )
}
