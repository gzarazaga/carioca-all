import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import type { FormacionInput } from '../../types/game'
import Card from '../card/Card'

type TipoFormacion = 'PIERNA' | 'ESCALERA'

export default function FormationBuilder() {
  const show = useGameStore((s) => s.showFormationBuilder)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const misCartas = useGameStore((s) => s.misCartas)
  const setShowFormationBuilder = useGameStore((s) => s.setShowFormationBuilder)
  const loading = useGameStore((s) => s.loading)
  const { bajar } = useGameActions()

  const [formaciones, setFormaciones] = useState<FormacionInput[]>([])
  const [currentCardIds, setCurrentCardIds] = useState<string[]>([])
  const [currentTipo, setCurrentTipo] = useState<TipoFormacion>('PIERNA')

  // Resetear estado cada vez que el builder se abre
  useEffect(() => {
    if (show) {
      setFormaciones([])
      setCurrentCardIds([])
      setCurrentTipo('PIERNA')
    }
  }, [show])

  if (!show) return null

  const assignedIds = formaciones.flatMap((f) => f.cartaIds)
  const poolIds = selectedCardIds.filter(
    (id) => !assignedIds.includes(id) && !currentCardIds.includes(id),
  )
  const poolCartas = misCartas.filter((c) => poolIds.includes(c.id))
  const currentCartas = misCartas.filter((c) => currentCardIds.includes(c.id))

  function toggleCard(cardId: string) {
    setCurrentCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    )
  }

  function agregarFormacion() {
    if (currentCardIds.length < 3) return
    setFormaciones((prev) => [...prev, { tipo: currentTipo, cartaIds: currentCardIds }])
    setCurrentCardIds([])
    setCurrentTipo('PIERNA')
  }

  function quitarFormacion(index: number) {
    setFormaciones((prev) => prev.filter((_, i) => i !== index))
  }

  async function confirmar() {
    const all: FormacionInput[] =
      currentCardIds.length >= 3
        ? [...formaciones, { tipo: currentTipo, cartaIds: currentCardIds }]
        : [...formaciones]
    if (all.length === 0) return
    await bajar(all)
    setFormaciones([])
    setCurrentCardIds([])
  }

  const canAgregar = currentCardIds.length >= 3 && poolIds.length > 0
  const totalFormaciones = formaciones.length + (currentCardIds.length >= 3 ? 1 : 0)
  const canConfirmar = !loading && totalFormaciones > 0

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Bajar formaciones</h2>

        {/* Pool de cartas disponibles */}
        {poolCartas.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-green-300 mb-2">
              Cartas disponibles{' '}
              <span className="text-xs text-gray-400">(click para agregar a la formación actual)</span>
              :
            </p>
            <div className="flex gap-1 flex-wrap">
              {poolCartas.map((c) => (
                <Card key={c.id} carta={c} small onClick={() => toggleCard(c.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Formación actual en construcción */}
        <div className="mb-4 border border-green-700 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-2 font-semibold">
            Formación actual{formaciones.length > 0 ? ` (#${formaciones.length + 1})` : ''}:
          </p>

          {currentCartas.length > 0 ? (
            <div className="flex gap-1 flex-wrap mb-3">
              {currentCartas.map((c) => (
                <Card
                  key={c.id}
                  carta={c}
                  small
                  selected
                  onClick={() => toggleCard(c.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-3">
              {poolIds.length > 0
                ? 'Seleccioná cartas de arriba para armar esta formación'
                : 'No quedan cartas disponibles'}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTipo('PIERNA')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  currentTipo === 'PIERNA' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Pierna
              </button>
              <button
                onClick={() => setCurrentTipo('ESCALERA')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  currentTipo === 'ESCALERA' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Escalera
              </button>
            </div>

            {poolIds.length > 0 && (
              <button
                onClick={agregarFormacion}
                disabled={!canAgregar}
                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors"
              >
                + Agregar al listado
              </button>
            )}
          </div>
        </div>

        {/* Formaciones ya armadas */}
        {formaciones.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-green-300 mb-2 font-semibold">
              Listas para bajar ({formaciones.length}):
            </p>
            <div className="flex flex-col gap-2">
              {formaciones.map((f, i) => {
                const cartas = misCartas.filter((c) => f.cartaIds.includes(c.id))
                return (
                  <div key={i} className="flex items-center gap-2 bg-green-800 rounded-lg p-2">
                    <span className="text-xs font-bold text-blue-300 shrink-0">{f.tipo}</span>
                    <div className="flex gap-1 flex-wrap flex-1">
                      {cartas.map((c) => (
                        <Card key={c.id} carta={c} small />
                      ))}
                    </div>
                    <button
                      onClick={() => quitarFormacion(i)}
                      className="text-xs text-red-400 hover:text-red-300 shrink-0 px-1"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowFormationBuilder(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={!canConfirmar}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
          >
            Confirmar ({totalFormaciones})
          </button>
        </div>
      </div>
    </div>
  )
}