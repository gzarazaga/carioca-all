import { View } from 'react-native'
import { useGameStore, useIsMyTurn, useMyPlayer } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Button from '../common/Button'

export default function ActionBar() {
  const estado = useGameStore((s) => s.estado)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const loading = useGameStore((s) => s.loading)
  const clearSelection = useGameStore((s) => s.clearSelection)
  const setShowFormationBuilder = useGameStore((s) => s.setShowFormationBuilder)
  const setShowPegarDialog = useGameStore((s) => s.setShowPegarDialog)
  const isMyTurn = useIsMyTurn()
  const myPlayer = useMyPlayer()
  const { descartar } = useGameActions()

  if (!estado || estado.estado !== 'EN_CURSO') return null

  const mustDiscard = isMyTurn && estado.estadoTurno === 'ESPERANDO_DESCARTAR'
  const hasSelection = selectedCardIds.length > 0
  const singleSelected = selectedCardIds.length === 1
  const hasFormations = estado.formacionesEnMesa.length > 0

  return (
    <View className="flex-row gap-2 flex-wrap justify-center p-2">
      {mustDiscard && singleSelected && (
        <Button onPress={() => descartar(selectedCardIds[0])} disabled={loading} variant="danger" size="sm">
          Descartar
        </Button>
      )}

      {mustDiscard && selectedCardIds.length >= 3 && (
        <Button onPress={() => setShowFormationBuilder(true)} disabled={loading} variant="primary" size="sm">
          Bajar formación
        </Button>
      )}

      {mustDiscard && singleSelected && hasFormations && (myPlayer?.haBajado || hasFormations) && (
        <Button onPress={() => setShowPegarDialog(true)} disabled={loading} variant="accent" size="sm">
          Pegar a formación
        </Button>
      )}

      {hasSelection && (
        <Button onPress={clearSelection} variant="neutral" size="sm" bold={false}>
          {`Limpiar (${selectedCardIds.length})`}
        </Button>
      )}
    </View>
  )
}
