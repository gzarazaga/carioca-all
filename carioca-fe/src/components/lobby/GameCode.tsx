import { useState } from 'react'
import Button from '../common/Button'

interface Props {
  partidaId: string
}

export default function GameCode({ partidaId }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(partidaId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-panel rounded-2xl p-5 text-center">
      <p className="text-[11px] uppercase tracking-wider text-felt-300 mb-2.5">Codigo de partida</p>
      <div className="flex items-center justify-center gap-2.5">
        <code className="text-2xl font-mono font-semibold bg-felt-900 border border-felt-600 text-success-400 px-4 py-2.5 rounded-xl tracking-wider drop-shadow-[0_0_10px_var(--color-success-600)]">
          {partidaId}
        </code>
        <Button onClick={copy} variant="success" size="md" bold={false}>
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>
      <p className="text-[11px] text-felt-400 mt-2.5">
        Comparte este codigo para que otros se unan
      </p>
    </div>
  )
}
