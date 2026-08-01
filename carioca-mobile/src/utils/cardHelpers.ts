const SUIT_SYMBOLS: Record<string, string> = {
  CORAZONES: '♥',
  DIAMANTES: '♦',
  TREBOLES: '♣',
  PICAS: '♠',
}

const SUIT_COLORS: Record<string, string> = {
  CORAZONES: 'text-red-600',
  DIAMANTES: 'text-red-600',
  TREBOLES: 'text-gray-900',
  PICAS: 'text-gray-900',
}

const VALUE_DISPLAY: Record<string, string> = {
  AS: 'A',
  DOS: '2',
  TRES: '3',
  CUATRO: '4',
  CINCO: '5',
  SEIS: '6',
  SIETE: '7',
  OCHO: '8',
  NUEVE: '9',
  DIEZ: '10',
  J: 'J',
  Q: 'Q',
  K: 'K',
  COMODIN: '★',
}

export function getSuitSymbol(palo: string | null): string {
  if (!palo) return ''
  return SUIT_SYMBOLS[palo] ?? ''
}

export function getSuitColor(palo: string | null): string {
  if (!palo) return 'text-purple-600'
  return SUIT_COLORS[palo] ?? 'text-gray-900'
}

export function getValueDisplay(valor: string): string {
  return VALUE_DISPLAY[valor] ?? valor
}

export function isJoker(valor: string): boolean {
  return valor === 'COMODIN'
}
