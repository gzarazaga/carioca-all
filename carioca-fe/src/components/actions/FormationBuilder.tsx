import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'

export default function FormationBuilder() {
  const show = useGameStore((s) => s.showFormationBuilder)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const misCartas = useGameStore((s) => s.misCartas)
  const setShowFormationBuilder = useGameStore((s) => s.setShowFormationBuilder)
  const loading = useGameStore((s) => s.loading)
  const { bajar } = useGameActions()
  const [tipo, setTipo] = useState<'PIERNA' | 'ESCALERA'>('PIERNA')

  if (!show) return null

  const selectedCartas = misCartas.filter((c) => selectedCardIds.includes(c.id))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Bajar formacion</h2>

        <div className="mb-4">
          <p className="text-sm text-green-300 mb-2">Cartas seleccionadas:</p>
          <div className="flex gap-1 flex-wrap">
            {selectedCartas.map((c) => (
              <Card key={c.id} carta={c} small />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-green-300 mb-2">Tipo:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTipo('PIERNA')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                tipo === 'PIERNA'
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Pierna (mismo valor)
            </button>
            <button
              onClick={() => setTipo('ESCALERA')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                tipo === 'ESCALERA'
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Escalera (consecutivas)
            </button>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowFormationBuilder(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => bajar(tipo, selectedCardIds)}
            disabled={loading || selectedCardIds.length < 3}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
