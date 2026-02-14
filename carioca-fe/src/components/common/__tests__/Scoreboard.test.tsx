import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Scoreboard from '../Scoreboard'
import { createJugador } from '../../../test/mocks/mockGameState'

describe('Scoreboard', () => {
  const jugadores = [
    createJugador({ id: 'p1', nombre: 'Alice', puntosTotales: 45 }),
    createJugador({ id: 'p2', nombre: 'Bob', puntosTotales: 12 }),
    createJugador({ id: 'p3', nombre: 'Carlos', puntosTotales: 78 }),
  ]

  it('renders players sorted by points (lowest first)', () => {
    const { container } = render(<Scoreboard jugadores={jugadores} />)

    const rows = container.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(3)

    // Bob (12) should be first, Alice (45) second, Carlos (78) third
    expect(rows[0]).toHaveTextContent('Bob')
    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Carlos')
  })

  it('shows points for each player', () => {
    render(<Scoreboard jugadores={jugadores} />)

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('78')).toBeInTheDocument()
  })

  it('shows position numbers', () => {
    const { container } = render(<Scoreboard jugadores={jugadores} />)

    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('1')
    expect(rows[1]).toHaveTextContent('2')
    expect(rows[2]).toHaveTextContent('3')
  })

  it('highlights winner with trophy emoji', () => {
    render(<Scoreboard jugadores={jugadores} ganadorId="p2" />)

    // Bob is the winner
    expect(screen.getByText(/Bob/)).toBeInTheDocument()
    // The cell should contain the trophy emoji
    const bobCell = screen.getByText((content, element) => {
      return element?.tagName === 'TD' && content.includes('Bob') && content.includes('🏆')
    })
    expect(bobCell).toBeInTheDocument()
  })

  it('does not show trophy when no winner specified', () => {
    const { container } = render(<Scoreboard jugadores={jugadores} />)

    expect(container.textContent).not.toContain('🏆')
  })

  it('does not show trophy for non-winner players', () => {
    render(<Scoreboard jugadores={jugadores} ganadorId="p2" />)

    // Alice and Carlos rows should not have trophy
    const aliceRow = screen.getByText('Alice').closest('tr')
    expect(aliceRow?.textContent).not.toContain('🏆')

    const carlosRow = screen.getByText('Carlos').closest('tr')
    expect(carlosRow?.textContent).not.toContain('🏆')
  })

  it('renders table header', () => {
    render(<Scoreboard jugadores={jugadores} />)

    expect(screen.getByText('Tabla de puntos')).toBeInTheDocument()
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Jugador')).toBeInTheDocument()
    expect(screen.getByText('Puntos')).toBeInTheDocument()
  })
})