import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlayerList from '../PlayerList'
import { createJugador } from '../../../test/mocks/mockGameState'

describe('PlayerList', () => {
  const jugadores = [
    createJugador({ id: 'p1', nombre: 'Alice', conectado: true }),
    createJugador({ id: 'p2', nombre: 'Bob', conectado: true }),
    createJugador({ id: 'p3', nombre: 'Carlos', conectado: false }),
  ]

  it('renders player names', () => {
    render(<PlayerList jugadores={jugadores} currentPlayerId={null} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
  })

  it('shows player count in header', () => {
    render(<PlayerList jugadores={jugadores} currentPlayerId={null} />)

    expect(screen.getByText('Jugadores (3/6)')).toBeInTheDocument()
  })

  it('shows connection indicator for connected players', () => {
    const { container } = render(
      <PlayerList jugadores={jugadores} currentPlayerId={null} />
    )

    const greenDots = container.querySelectorAll('.bg-green-400')
    const grayDots = container.querySelectorAll('.bg-gray-500')

    // Alice and Bob are connected
    expect(greenDots).toHaveLength(2)
    // Carlos is disconnected
    expect(grayDots).toHaveLength(1)
  })

  it('shows "Tu" badge for current player', () => {
    render(<PlayerList jugadores={jugadores} currentPlayerId="p1" />)

    expect(screen.getByText('Tu')).toBeInTheDocument()
  })

  it('does not show "Tu" badge when currentPlayerId is null', () => {
    render(<PlayerList jugadores={jugadores} currentPlayerId={null} />)

    expect(screen.queryByText('Tu')).not.toBeInTheDocument()
  })

  it('does not show "Tu" badge for other players', () => {
    render(<PlayerList jugadores={jugadores} currentPlayerId="p1" />)

    // Only one "Tu" badge, next to Alice
    const tuBadges = screen.getAllByText('Tu')
    expect(tuBadges).toHaveLength(1)
  })

  it('shows warning when fewer than 2 players', () => {
    const singlePlayer = [createJugador({ id: 'p1', nombre: 'Solo' })]
    render(<PlayerList jugadores={singlePlayer} currentPlayerId={null} />)

    expect(
      screen.getByText('Se necesitan al menos 2 jugadores para iniciar')
    ).toBeInTheDocument()
  })

  it('does not show warning when 2 or more players', () => {
    render(<PlayerList jugadores={jugadores} currentPlayerId={null} />)

    expect(
      screen.queryByText('Se necesitan al menos 2 jugadores para iniciar')
    ).not.toBeInTheDocument()
  })
})