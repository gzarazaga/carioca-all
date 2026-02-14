import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CardHand from '../CardHand'
import { createCarta } from '../../../test/mocks/mockGameState'

describe('CardHand', () => {
  const cartas = [
    createCarta({ id: 'c1', valor: 'AS', palo: 'CORAZONES', notacion: 'AC' }),
    createCarta({ id: 'c2', valor: 'K', palo: 'PICAS', notacion: 'KP' }),
    createCarta({ id: 'c3', valor: 'DIEZ', palo: 'DIAMANTES', notacion: '10D' }),
  ]

  it('renders all cards passed as props', () => {
    render(<CardHand cartas={cartas} selectedIds={[]} />)

    // AS -> 'A', K -> 'K', DIEZ -> '10', each displayed twice (top and bottom)
    expect(screen.getAllByText('A')).toHaveLength(2)
    expect(screen.getAllByText('K')).toHaveLength(2)
    expect(screen.getAllByText('10')).toHaveLength(2)
  })

  it('marks selected cards visually', () => {
    const { container } = render(
      <CardHand cartas={cartas} selectedIds={['c1']} />
    )

    const cardElements = container.querySelectorAll('.card-selected')
    expect(cardElements).toHaveLength(1)
  })

  it('does not mark unselected cards', () => {
    const { container } = render(
      <CardHand cartas={cartas} selectedIds={[]} />
    )

    const cardElements = container.querySelectorAll('.card-selected')
    expect(cardElements).toHaveLength(0)
  })

  it('calls onCardClick with the correct card id', () => {
    const handleClick = vi.fn()
    render(
      <CardHand cartas={cartas} selectedIds={[]} onCardClick={handleClick} />
    )

    // Click on the suit symbol of the second card (K of PICAS -> ♠)
    const spadesSymbol = screen.getByText('♠')
    // Click the parent card div
    fireEvent.click(spadesSymbol.closest('[class*="border-"]')!)

    expect(handleClick).toHaveBeenCalledWith('c2')
  })

  it('calls onCardClick for each distinct card', () => {
    const handleClick = vi.fn()
    render(
      <CardHand cartas={cartas} selectedIds={[]} onCardClick={handleClick} />
    )

    // Click on heart symbol (first card)
    const heartSymbol = screen.getByText('♥')
    fireEvent.click(heartSymbol.closest('[class*="border-"]')!)
    expect(handleClick).toHaveBeenCalledWith('c1')

    // Click on diamond symbol (third card)
    const diamondSymbol = screen.getByText('♦')
    fireEvent.click(diamondSymbol.closest('[class*="border-"]')!)
    expect(handleClick).toHaveBeenCalledWith('c3')
  })

  it('renders single card without rotation', () => {
    const singleCard = [cartas[0]]
    const { container } = render(
      <CardHand cartas={singleCard} selectedIds={[]} />
    )

    const wrapper = container.querySelector('[style]') as HTMLElement
    expect(wrapper.style.transform).toContain('rotate(0deg)')
  })
})
