import type { Jugador } from '../../types/game'

interface Props {
  jugadores: Jugador[]
  currentPlayerId: string | null
}

export default function PlayerList({ jugadores, currentPlayerId }: Props) {
  return (
    <div className="bg-green-800/60 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-3">Jugadores ({jugadores.length}/6)</h3>
      <ul className="space-y-2">
        {jugadores.map((j) => (
          <li
            key={j.id}
            className="flex items-center gap-2 bg-green-700/40 rounded px-3 py-2"
          >
            <div className={`w-2 h-2 rounded-full ${j.conectado ? 'bg-green-400' : 'bg-gray-500'}`} />
            <span className="font-medium">{j.nombre}</span>
            {j.id === currentPlayerId && (
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded ml-auto">Tu</span>
            )}
          </li>
        ))}
      </ul>
      {jugadores.length < 2 && (
        <p className="text-sm text-yellow-300 mt-3">
          Se necesitan al menos 2 jugadores para iniciar
        </p>
      )}
    </div>
  )
}
