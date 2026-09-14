import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// Publisher ID de AdSense. Los slot IDs se pasan por prop: cada <AdUnit>
// corresponde a una unidad de anuncio creada en el dashboard de AdSense.
const AD_CLIENT = 'ca-pub-9702844972960784'

interface Props {
  /** data-ad-slot de la unidad, creada en el dashboard de AdSense */
  slot: string
  className?: string
}

/**
 * Bloque de anuncio de AdSense. Reserva su propio espacio (evita salto de
 * layout) y se etiqueta como "Publicidad". No se usa en la mesa de juego
 * (GamePage): ahi el riesgo de clicks accidentales durante una partida es
 * demasiado alto.
 */
export default function AdUnit({ slot, className = '' }: Props) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Script de AdSense no disponible (bloqueador de anuncios, offline, etc.)
    }
  }, [])

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-felt-500">Publicidad</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: 100 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
