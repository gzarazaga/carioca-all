import { View, Text, Pressable } from 'react-native'
import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import CardBack from '../card/CardBack'

export default function DrawPile() {
  const cartasEnMazo = useGameStore((s) => s.estado?.cartasEnMazo ?? 0)
  const estadoTurno = useGameStore((s) => s.estado?.estadoTurno)
  const isMyTurn = useIsMyTurn()
  const loading = useGameStore((s) => s.loading)
  const { robar } = useGameActions()

  const canDraw = isMyTurn && estadoTurno === 'ESPERANDO_ROBAR' && !loading

  return (
    <Pressable
      onPress={() => canDraw && robar(true)}
      disabled={!canDraw}
      className={`items-center gap-1 p-2 rounded-lg ${canDraw ? 'border-2 border-yellow-400/60' : 'opacity-70'}`}
    >
      <CardBack />
      <Text className="text-xs text-green-300">{cartasEnMazo} cartas</Text>
      {canDraw && <Text className="text-xs text-yellow-300">Tocá para robar</Text>}
    </Pressable>
  )
}
