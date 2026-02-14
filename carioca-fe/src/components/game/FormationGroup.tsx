import type { Formacion } from '../../types/game'
import { useGameStore } from '../../stores/gameStore'
import Card from '../card/Card'

interface Props {
  formacion: Formacion
}

export default function FormationGroup({ formacion }: Props) {
  const jugadores = useGameStore((s) => s.estado?.jugadores ?? [])
  const owner = jugadores.find((j) => j.id === formacion.propietarioId)

  return (
    <div className="bg-green-800/50 rounded-lg p-2 border border-green-600">
      <div className="text-xs text-green-300 mb-1">
        {formacion.tipo === 'PIERNA' ? 'Pierna' : 'Escalera'}
        {owner && <span className="ml-1">({owner.nombre})</span>}
      </div>
      <div className="flex -space-x-2">
        {formacion.cartas.map((carta) => (
          <Card key={carta.id} carta={carta} small />
        ))}
      </div>
    </div>
  )
}
