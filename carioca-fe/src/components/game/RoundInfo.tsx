import { useGameStore } from '../../stores/gameStore'

export default function RoundInfo() {
  const estado = useGameStore((s) => s.estado)
  if (!estado) return null

  return (
    <div className="glass-panel rounded-xl px-5 py-2.5 text-center">
      <div className="text-[11px] uppercase tracking-wider text-felt-300">Ronda {estado.numeroRonda} / 7</div>
      <div className="font-display font-semibold text-sm mt-0.5">{estado.descripcionRonda}</div>
    </div>
  )
}
