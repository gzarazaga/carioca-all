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
    <div className="bg-felt-800/60 rounded-lg p-4 text-center">
      <p className="text-sm text-felt-300 mb-2">Codigo de partida</p>
      <div className="flex items-center justify-center gap-2">
        <code className="text-2xl font-mono font-bold bg-felt-700/60 px-4 py-2 rounded tracking-wider">
          {partidaId}
        </code>
        <Button onClick={copy} variant="primary" size="md" bold={false}>
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>
      <p className="text-xs text-felt-400 mt-2">
        Comparte este codigo para que otros se unan
      </p>
    </div>
  )
}
