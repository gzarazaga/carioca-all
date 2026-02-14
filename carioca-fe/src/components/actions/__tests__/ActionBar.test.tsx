import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ActionBar from '../ActionBar'
import { useGameStore } from '../../../stores/gameStore'
import { createEstadoJuego, createJugador, createFormacion } from '../../../test/mocks/mockGameState'

// Mock useGameActions hook
vi.mock('../../../hooks/useGameActions', () => ({
  useGameActions: () => ({
    descartar: mockDescartar,
    robar: vi.fn(),
    bajar: vi.fn(),
    pegar: vi.fn(),
    refresh: vi.fn(),
  }),
}))

const mockDescartar = vi.fn()

describe('ActionBar', () => {
  beforeEach(() => {
    mockDescartar.mockReset()
    // Reset store to default state
    useGameStore.setState({
      estado: null,
      jugadorId: 'jugador-1',
      selectedCardIds: [],
      loading: false,
      showFormationBuilder: false,
      showPegarDialog: false,
    })
  })

  it('returns null when estado is null', () => {
    const { container } = render(<ActionBar />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when game is not EN_CURSO', () => {
    useGameStore.setState({
      estado: createEstadoJuego({ estado: 'ESPERANDO_JUGADORES' }),
    })

    const { container } = render(<ActionBar />)
    expect(container.firstChild).toBeNull()
  })

  it('does not show action buttons if not my turn', () => {
    useGameStore.setState({
      jugadorId: 'jugador-2',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['card-1'],
    })

    render(<ActionBar />)
    expect(screen.queryByText('Descartar')).not.toBeInTheDocument()
    expect(screen.queryByText('Bajar formacion')).not.toBeInTheDocument()
  })

  it('shows Descartar button with 1 selected card in ESPERANDO_DESCARTAR state', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['card-1'],
    })

    render(<ActionBar />)
    expect(screen.getByText('Descartar')).toBeInTheDocument()
  })

  it('does not show Descartar button in ESPERANDO_ROBAR state', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_ROBAR',
      }),
      selectedCardIds: ['card-1'],
    })

    render(<ActionBar />)
    expect(screen.queryByText('Descartar')).not.toBeInTheDocument()
  })

  it('Descartar button calls descartar with the selected card id', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['card-99'],
    })

    render(<ActionBar />)
    fireEvent.click(screen.getByText('Descartar'))

    expect(mockDescartar).toHaveBeenCalledWith('card-99')
  })

  it('shows Bajar button with 3+ selected cards in ESPERANDO_DESCARTAR', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['c1', 'c2', 'c3'],
    })

    render(<ActionBar />)
    expect(screen.getByText('Bajar formacion')).toBeInTheDocument()
  })

  it('does not show Bajar button with fewer than 3 cards', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['c1', 'c2'],
    })

    render(<ActionBar />)
    expect(screen.queryByText('Bajar formacion')).not.toBeInTheDocument()
  })

  it('shows Limpiar button when cards are selected', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['c1', 'c2'],
    })

    render(<ActionBar />)
    expect(screen.getByText('Limpiar (2)')).toBeInTheDocument()
  })

  it('does not show Limpiar button when no cards selected', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: [],
    })

    render(<ActionBar />)
    expect(screen.queryByText(/Limpiar/)).not.toBeInTheDocument()
  })

  it('Limpiar button clears the selection', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['c1', 'c2'],
    })

    render(<ActionBar />)
    fireEvent.click(screen.getByText('Limpiar (2)'))

    expect(useGameStore.getState().selectedCardIds).toEqual([])
  })

  it('shows Pegar button when 1 card selected and formations exist on table', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
        formacionesEnMesa: [createFormacion()],
        jugadores: [
          createJugador({ id: 'jugador-1', nombre: 'Jugador 1', haBajado: true }),
          createJugador({ id: 'jugador-2', nombre: 'Jugador 2' }),
        ],
      }),
      selectedCardIds: ['c1'],
    })

    render(<ActionBar />)
    expect(screen.getByText('Pegar a formacion')).toBeInTheDocument()
  })

  it('disables buttons when loading', () => {
    useGameStore.setState({
      jugadorId: 'jugador-1',
      estado: createEstadoJuego({
        jugadorActualId: 'jugador-1',
        estadoTurno: 'ESPERANDO_DESCARTAR',
      }),
      selectedCardIds: ['c1'],
      loading: true,
    })

    render(<ActionBar />)
    const descartarBtn = screen.getByText('Descartar')
    expect(descartarBtn).toBeDisabled()
  })
})
