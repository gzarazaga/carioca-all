import { Text, View } from 'react-native'
import type { Formacion } from '../../types/game'
import { useGameStore } from '../../stores/gameStore'
import GlassPanel from '../common/GlassPanel'
import Card from '../card/Card'

interface Props {
  formacion: Formacion
}

export default function FormationGroup({ formacion }: Props) {
  const jugadores = useGameStore((s) => s.estado?.jugadores ?? [])
  const owner = jugadores.find((j) => j.id === formacion.propietarioId)

  return (
    <GlassPanel>
      <View className="p-2.5">
        <Text className="text-[11px] text-felt-300 mb-1.5">
          {formacion.tipo === 'PIERNA' ? 'Pierna' : 'Escalera'}
          {owner && ` (${owner.nombre})`}
        </Text>
        <View className="flex-row">
          {formacion.cartas.map((carta, i) => (
            <View key={carta.id} style={{ marginLeft: i === 0 ? 0 : -14 }}>
              <Card carta={carta} small />
            </View>
          ))}
        </View>
      </View>
    </GlassPanel>
  )
}
