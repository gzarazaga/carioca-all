import { useGameStore, useFormaciones } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'
import FormationGroup from '../game/FormationGroup'

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
      <div className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Pegar carta a formacion</h2>

        <div className="mb-4">
          <p className="text-sm text-green-300 mb-2">Carta:</p>
          <Card carta={carta} />
        </div>

        <div className="mb-4">
          <p className="text-sm text-green-300 mb-2">Elegir formacion:</p>
          <div className="flex flex-col gap-3">
            {formaciones.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <FormationGroup formacion={f} />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => pegar(carta.id, f.id, true)}
                    disabled={loading}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    Al inicio
                  </button>
                  <button
                    onClick={() => pegar(carta.id, f.id, false)}
                    disabled={loading}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    Al final
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowPegarDialog(false)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
