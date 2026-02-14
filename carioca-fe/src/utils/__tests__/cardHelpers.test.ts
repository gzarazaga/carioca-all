import { describe, it, expect } from 'vitest'
import { getSuitSymbol, getSuitColor, getValueDisplay, isJoker } from '../cardHelpers'

describe('getSuitSymbol', () => {
  it('returns heart symbol for CORAZONES', () => {
    expect(getSuitSymbol('CORAZONES')).toBe('♥')
  })

  it('returns diamond symbol for DIAMANTES', () => {
    expect(getSuitSymbol('DIAMANTES')).toBe('♦')
  })

  it('returns club symbol for TREBOLES', () => {
    expect(getSuitSymbol('TREBOLES')).toBe('♣')
  })

  it('returns spade symbol for PICAS', () => {
    expect(getSuitSymbol('PICAS')).toBe('♠')
  })

  it('returns empty string for null', () => {
    expect(getSuitSymbol(null)).toBe('')
  })

  it('returns empty string for unknown suit', () => {
    expect(getSuitSymbol('UNKNOWN')).toBe('')
  })
})

describe('getSuitColor', () => {
  it('returns red for CORAZONES', () => {
    expect(getSuitColor('CORAZONES')).toBe('text-red-600')
  })

  it('returns red for DIAMANTES', () => {
    expect(getSuitColor('DIAMANTES')).toBe('text-red-600')
  })

  it('returns dark for TREBOLES', () => {
    expect(getSuitColor('TREBOLES')).toBe('text-gray-900')
  })

  it('returns dark for PICAS', () => {
    expect(getSuitColor('PICAS')).toBe('text-gray-900')
  })

  it('returns purple for null (joker)', () => {
    expect(getSuitColor(null)).toBe('text-purple-600')
  })

  it('returns default dark for unknown suit', () => {
    expect(getSuitColor('UNKNOWN')).toBe('text-gray-900')
  })
})

describe('getValueDisplay', () => {
  const cases: [string, string][] = [
    ['AS', 'A'],
    ['DOS', '2'],
    ['TRES', '3'],
    ['CUATRO', '4'],
    ['CINCO', '5'],
    ['SEIS', '6'],
    ['SIETE', '7'],
    ['OCHO', '8'],
    ['NUEVE', '9'],
    ['DIEZ', '10'],
    ['J', 'J'],
    ['Q', 'Q'],
    ['K', 'K'],
    ['COMODIN', '★'],
  ]

  it.each(cases)('maps %s to %s', (input, expected) => {
    expect(getValueDisplay(input)).toBe(expected)
  })

  it('returns the value itself for unknown values', () => {
    expect(getValueDisplay('UNKNOWN')).toBe('UNKNOWN')
  })
})

describe('isJoker', () => {
  it('returns true for COMODIN', () => {
    expect(isJoker('COMODIN')).toBe(true)
  })

  it('returns false for AS', () => {
    expect(isJoker('AS')).toBe(false)
  })

  it('returns false for K', () => {
    expect(isJoker('K')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isJoker('')).toBe(false)
  })
})