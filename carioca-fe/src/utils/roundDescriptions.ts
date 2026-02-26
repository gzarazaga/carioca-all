const ROUND_DESCRIPTIONS: Record<number, string> = {
  1: '2 Piernas',
  2: '1 Pierna + 1 Escalera',
  3: '2 Escaleras',
  4: '3 Piernas',
  5: '2 Piernas + 1 Escalera',
  6: '1 Pierna + 2 Escaleras',
  7: '3 Escaleras',
}

export function getRoundDescription(round: number): string {
  return ROUND_DESCRIPTIONS[round] ?? `Ronda ${round}`
}

export function getRoundRequirements(round: number): { piernas: number; escaleras: number } {
  const reqs: Record<number, { piernas: number; escaleras: number }> = {
    1: { piernas: 2, escaleras: 0 },
    2: { piernas: 1, escaleras: 1 },
    3: { piernas: 0, escaleras: 2 },
    4: { piernas: 3, escaleras: 0 },
    5: { piernas: 2, escaleras: 1 },
    6: { piernas: 1, escaleras: 2 },
    7: { piernas: 0, escaleras: 3 },
  }
  return reqs[round] ?? { piernas: 0, escaleras: 0 }
}

const INITIAL_CARDS = 7

export function getCardsPerRound(round: number): number {
  if (round < 1 || round > 7) return 0
  return INITIAL_CARDS + (round - 1)
}
