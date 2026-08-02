import { useGameStore } from '../../stores/gameStore'

const COLORS = {
  info: 'bg-primary-600',
  success: 'bg-success-600',
  error: 'bg-danger-600',
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
            aria-label="Cerrar"
            className="ml-2 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
