import { useGameStore } from '../../stores/gameStore'

export default function RoundInfo() {
  const estado = useGameStore((s) => s.estado)
  if (!estado) return null

  return (
    <div className="bg-green-800/80 rounded-lg px-4 py-2 text-center">
      <div className="text-sm text-green-300">Ronda {estado.numeroRonda} / 7</div>
      <div className="text-lg font-bold">{estado.descripcionRonda}</div>
    </div>
  )
}
