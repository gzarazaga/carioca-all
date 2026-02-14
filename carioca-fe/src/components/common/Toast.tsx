import { useGameStore } from '../../stores/gameStore'

const COLORS = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  error: 'bg-red-600',
}

export default function Toast() {
  const toasts = useGameStore((s) => s.toasts)
  const removeToast = useGameStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${COLORS[t.type]} px-4 py-2 rounded-lg shadow-lg text-sm font-medium
            flex items-center gap-2 animate-[slideIn_0.3s_ease-out]`}
        >
          <span>{t.text}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
