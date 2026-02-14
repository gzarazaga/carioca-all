import type { Jugador } from '../../types/game'

interface Props {
  jugadores: Jugador[]
  ganadorId?: string | null
}

export default function Scoreboard({ jugadores, ganadorId }: Props) {
  const sorted = [...jugadores].sort((a, b) => a.puntosTotales - b.puntosTotales)

  return (
    <div className="bg-green-800/60 rounded-lg p-4 w-full max-w-md">
      <h3 className="text-lg font-bold mb-3 text-center">Tabla de puntos</h3>
      <table className="w-full">
        <thead>
          <tr className="text-green-300 text-sm border-b border-green-600">
            <th className="text-left py-1">#</th>
            <th className="text-left py-1">Jugador</th>
            <th className="text-right py-1">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((j, i) => (
            <tr
              key={j.id}
              className={`border-b border-green-700/30 ${
                j.id === ganadorId ? 'text-yellow-300 font-bold' : ''
              }`}
            >
              <td className="py-2 text-sm">{i + 1}</td>
              <td className="py-2">
                {j.nombre}
                {j.id === ganadorId && ' 🏆'}
              </td>
              <td className="py-2 text-right font-mono">{j.puntosTotales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
