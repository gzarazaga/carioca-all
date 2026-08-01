import { View, Text, Pressable } from 'react-native'
import { useGameStore, useIsMyTurn, useMyPlayer } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'

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
        <Pressable
          onPress={() => descartar(selectedCardIds[0])}
          disabled={loading}
          className={`px-4 py-2 bg-red-600 rounded-lg ${loading ? 'opacity-50' : ''}`}
        >
          <Text className="font-bold text-sm text-white">Descartar</Text>
        </Pressable>
      )}

      {mustDiscard && selectedCardIds.length >= 3 && (
        <Pressable
          onPress={() => setShowFormationBuilder(true)}
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 rounded-lg ${loading ? 'opacity-50' : ''}`}
        >
          <Text className="font-bold text-sm text-white">Bajar formacion</Text>
        </Pressable>
      )}

      {mustDiscard && singleSelected && hasFormations && (myPlayer?.haBajado || hasFormations) && (
        <Pressable
          onPress={() => setShowPegarDialog(true)}
          disabled={loading}
          className={`px-4 py-2 bg-purple-600 rounded-lg ${loading ? 'opacity-50' : ''}`}
        >
          <Text className="font-bold text-sm text-white">Pegar a formacion</Text>
        </Pressable>
      )}

      {hasSelection && (
        <Pressable
          onPress={clearSelection}
          className="px-4 py-2 bg-gray-600 rounded-lg"
        >
          <Text className="text-sm text-white">Limpiar ({selectedCardIds.length})</Text>
        </Pressable>
      )}
    </View>
  )
}
