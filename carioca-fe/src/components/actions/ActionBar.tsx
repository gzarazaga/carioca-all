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
    <div className="flex gap-2 flex-wrap justify-center p-2">
      {/* Discard */}
      {mustDiscard && singleSelected && (
        <Button onClick={() => descartar(selectedCardIds[0])} disabled={loading} variant="danger" size="md">
          Descartar
        </Button>
      )}

      {/* Bajar formation */}
      {mustDiscard && selectedCardIds.length >= 3 && (
        <Button onClick={() => setShowFormationBuilder(true)} disabled={loading} variant="primary" size="md">
          Bajar formacion
        </Button>
      )}

      {/* Pegar */}
      {mustDiscard && singleSelected && hasFormations && (myPlayer?.haBajado || hasFormations) && (
        <Button onClick={() => setShowPegarDialog(true)} disabled={loading} variant="accent" size="md">
          Pegar a formacion
        </Button>
      )}

      {/* Clear selection */}
      {hasSelection && (
        <Button onClick={clearSelection} variant="neutral" size="md" bold={false}>
          Limpiar ({selectedCardIds.length})
        </Button>
      )}
    </div>
  )
}
