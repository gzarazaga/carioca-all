import type { Jugador } from '../../types/game'

interface Props {
  jugadores: Jugador[]
  currentPlayerId: string | null
}

export default function PlayerList({ jugadores, currentPlayerId }: Props) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="font-display font-semibold text-sm mb-3">Jugadores ({jugadores.length}/6)</h3>
      <ul className="space-y-2">
        {jugadores.map((j) => (
          <li
            key={j.id}
            className="flex items-center gap-2 bg-felt-700/50 rounded-xl px-3.5 py-2.5"
          >
            <div
              className={`w-2 h-2 rounded-full ${j.conectado ? 'bg-success-400 shadow-[0_0_8px_var(--color-success-400)]' : 'bg-neutral-500'}`}
            />
            <span className="font-medium">{j.nombre}</span>
            {j.id === currentPlayerId && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-600/25 text-primary-300 px-2 py-0.5 rounded-md ml-auto">
                Tu
              </span>
            )}
          </li>
        ))}
      </ul>
      {jugadores.length < 2 && (
        <p className="text-sm text-warning-300 mt-3">
          Se necesitan al menos 2 jugadores para iniciar
        </p>
      )}
    </div>
  )
}
