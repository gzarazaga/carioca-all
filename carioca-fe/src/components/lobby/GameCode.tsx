import { useState } from 'react'

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
    <div className="bg-green-800/60 rounded-lg p-4 text-center">
      <p className="text-sm text-green-300 mb-2">Codigo de partida</p>
      <div className="flex items-center justify-center gap-2">
        <code className="text-2xl font-mono font-bold bg-green-700/60 px-4 py-2 rounded tracking-wider">
          {partidaId}
        </code>
        <button
          onClick={copy}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <p className="text-xs text-green-400 mt-2">
        Comparte este codigo para que otros se unan
      </p>
    </div>
  )
}
