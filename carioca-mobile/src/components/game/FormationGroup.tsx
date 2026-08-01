import { View, Text } from 'react-native'
import type { Formacion } from '../../types/game'
import { useGameStore } from '../../stores/gameStore'
import Card from '../card/Card'

interface Props {
  formacion: Formacion
}

export default function FormationGroup({ formacion }: Props) {
  const jugadores = useGameStore((s) => s.estado?.jugadores ?? [])
  const owner = jugadores.find((j) => j.id === formacion.propietarioId)

  return (
    <View className="bg-green-800/50 rounded-lg p-2 border border-green-600">
      <Text className="text-xs text-green-300 mb-1">
        {formacion.tipo === 'PIERNA' ? 'Pierna' : 'Escalera'}
        {owner && ` (${owner.nombre})`}
      </Text>
      <View className="flex-row">
        {formacion.cartas.map((carta, i) => (
          <View key={carta.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
            <Card carta={carta} small />
          </View>
        ))}
      </View>
    </View>
  )
}
