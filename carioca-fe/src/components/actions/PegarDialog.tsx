import { useGameStore, useFormaciones } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'
import FormationGroup from '../game/FormationGroup'
import Button from '../common/Button'

export default function PegarDialog() {
  const show = useGameStore((s) => s.showPegarDialog)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const misCartas = useGameStore((s) => s.misCartas)
  const setShowPegarDialog = useGameStore((s) => s.setShowPegarDialog)
  const loading = useGameStore((s) => s.loading)
  const formaciones = useFormaciones()
  const { pegar } = useGameActions()

  if (!show || selectedCardIds.length !== 1) return null

  const carta = misCartas.find((c) => c.id === selectedCardIds[0])
  if (!carta) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-felt-900 border border-felt-600 rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Pegar carta a formacion</h2>

        <div className="mb-4">
          <p className="text-sm text-felt-300 mb-2">Carta:</p>
          <Card carta={carta} />
        </div>

        <div className="mb-4">
          <p className="text-sm text-felt-300 mb-2">Elegir formacion:</p>
          <div className="flex flex-col gap-3">
            {formaciones.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <FormationGroup formacion={f} />
                <div className="flex flex-col gap-1">
                  <Button onClick={() => pegar(carta.id, f.id, true)} disabled={loading} variant="accent" size="sm">
                    Al inicio
                  </Button>
                  <Button onClick={() => pegar(carta.id, f.id, false)} disabled={loading} variant="accent" size="sm">
                    Al final
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => setShowPegarDialog(false)} variant="neutral" size="md" bold={false}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
