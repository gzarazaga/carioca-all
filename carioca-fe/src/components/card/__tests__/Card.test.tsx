import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card from '../Card'
import { createCarta } from '../../../test/mocks/mockGameState'

describe('Card', () => {
  it('renders card value and suit symbol correctly', () => {
    const carta = createCarta({ valor: 'AS', palo: 'CORAZONES' })
    render(<Card carta={carta} />)

    // AS maps to 'A', CORAZONES maps to '♥'
    expect(screen.getAllByText('A')).toHaveLength(2) // top and bottom
    expect(screen.getByText('♥')).toBeInTheDocument()
  })

  it('shows blue border when selected=true', () => {
    const carta = createCarta()
    const { container } = render(<Card carta={carta} selected={true} />)

    const cardDiv = container.firstChild as HTMLElement
    expect(cardDiv.className).toContain('border-blue-400')
    expect(cardDiv.className).toContain('card-selected')
  })

  it('does not show blue border when selected=false', () => {
    const carta = createCarta()
    const { container } = render(<Card carta={carta} selected={false} />)

    const cardDiv = container.firstChild as HTMLElement
    expect(cardDiv.className).not.toContain('border-blue-400')
    expect(cardDiv.className).toContain('border-gray-300')
  })

  it('calls onClick when clicked', () => {
    const carta = createCarta()
    const handleClick = vi.fn()
    const { container } = render(<Card carta={carta} onClick={handleClick} />)

    fireEvent.click(container.firstChild as HTMLElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('small mode renders smaller', () => {
    const carta = createCarta()
    const { container } = render(<Card carta={carta} small={true} />)

    const cardDiv = container.firstChild as HTMLElement
    expect(cardDiv.className).toContain('w-12')
    expect(cardDiv.className).toContain('h-18')
    expect(cardDiv.className).toContain('text-xs')
  })

  it('default mode renders normal size', () => {
    const carta = createCarta()
    const { container } = render(<Card carta={carta} />)

    const cardDiv = container.firstChild as HTMLElement
    expect(cardDiv.className).toContain('w-16')
    expect(cardDiv.className).toContain('h-24')
    expect(cardDiv.className).toContain('text-sm')
  })

  it('renders joker (COMODIN) correctly with joker emoji', () => {
    const carta = createCarta({ valor: 'COMODIN', palo: null })
    render(<Card carta={carta} />)

    // COMODIN maps to '★' for value display
    expect(screen.getAllByText('★')).toHaveLength(2) // top and bottom
    // Joker shows 🃏 instead of suit symbol
    expect(screen.getByText('🃏')).toBeInTheDocument()
  })

  it('renders hearts as red', () => {
    const carta = createCarta({ valor: 'DIEZ', palo: 'CORAZONES' })
    const { container } = render(<Card carta={carta} />)

    // The value elements should have red color class
    const valueElements = container.querySelectorAll('.text-red-600')
    expect(valueElements.length).toBeGreaterThan(0)
  })

  it('renders spades as dark', () => {
    const carta = createCarta({ valor: 'K', palo: 'PICAS' })
    const { container } = render(<Card carta={carta} />)

    const darkElements = container.querySelectorAll('.text-gray-900')
    expect(darkElements.length).toBeGreaterThan(0)
  })
})