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
    <div className="flex gap-2 flex-wrap justify-center p-2">
      {/* Discard */}
      {mustDiscard && singleSelected && (
        <button
          onClick={() => descartar(selectedCardIds[0])}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
        >
          Descartar
        </button>
      )}

      {/* Bajar formation */}
      {mustDiscard && selectedCardIds.length >= 3 && (
        <button
          onClick={() => setShowFormationBuilder(true)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
        >
          Bajar formacion
        </button>
      )}

      {/* Pegar */}
      {mustDiscard && singleSelected && hasFormations && (myPlayer?.haBajado || hasFormations) && (
        <button
          onClick={() => setShowPegarDialog(true)}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
        >
          Pegar a formacion
        </button>
      )}

      {/* Clear selection */}
      {hasSelection && (
        <button
          onClick={clearSelection}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
        >
          Limpiar ({selectedCardIds.length})
        </button>
      )}
    </div>
  )
}
