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
    <div className="glass-panel rounded-xl p-2.5">
      <div className="text-[11px] text-felt-300 mb-1.5">
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
