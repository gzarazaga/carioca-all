import type { Jugador } from '../../types/game'
import { TrophyIcon } from './icons'

interface Props {
  jugadores: Jugador[]
  ganadorId?: string | null
}

export default function Scoreboard({ jugadores, ganadorId }: Props) {
  const sorted = [...jugadores].sort((a, b) => a.puntosTotales - b.puntosTotales)

  return (
    <div className="glass-panel rounded-2xl p-5 w-full max-w-md">
      <h3 className="font-display font-semibold text-base mb-3 text-center">Tabla de puntos</h3>
      <table className="w-full">
        <thead>
          <tr className="text-felt-300 text-xs uppercase tracking-wider border-b border-felt-600">
            <th className="text-left py-1.5">#</th>
            <th className="text-left py-1.5">Jugador</th>
            <th className="text-right py-1.5">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((j, i) => (
            <tr
              key={j.id}
              className={`border-b border-felt-700/30 ${
                j.id === ganadorId ? 'text-warning-300 font-semibold' : ''
              }`}
            >
              <td className="py-2 text-sm">{i + 1}</td>
              <td className="py-2 flex items-center gap-1.5">
                {j.nombre}
                {j.id === ganadorId && (
                  <span role="img" aria-label="Ganador">
                    <TrophyIcon className="w-4 h-4" />
                  </span>
                )}
              </td>
              <td className="py-2 text-right font-mono">{j.puntosTotales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
