import { describe, it, expect } from 'vitest'
import { getRoundDescription, getRoundRequirements } from '../roundDescriptions'

describe('getRoundDescription', () => {
  const cases: [number, string][] = [
    [1, '2 Piernas'],
    [2, '1 Pierna + 1 Escalera'],
    [3, '2 Escaleras'],
    [4, '3 Piernas'],
    [5, '2 Piernas + 1 Escalera'],
    [6, '1 Pierna + 2 Escaleras'],
    [7, '3 Escaleras'],
  ]

  it.each(cases)('round %i returns "%s"', (round, expected) => {
    expect(getRoundDescription(round)).toBe(expected)
  })

  it('returns fallback for unknown round', () => {
    expect(getRoundDescription(99)).toBe('Ronda 99')
  })
})

describe('getRoundRequirements', () => {
  const cases: [number, number, number][] = [
    [1, 2, 0],
    [2, 1, 1],
    [3, 0, 2],
    [4, 3, 0],
    [5, 2, 1],
    [6, 1, 2],
    [7, 0, 3],
  ]

  it.each(cases)(
    'round %i requires %i piernas and %i escaleras',
    (round, piernas, escaleras) => {
      expect(getRoundRequirements(round)).toEqual({ piernas, escaleras })
    },
  )

  it('returns zeros for unknown round', () => {
    expect(getRoundRequirements(99)).toEqual({ piernas: 0, escaleras: 0 })
  })
})