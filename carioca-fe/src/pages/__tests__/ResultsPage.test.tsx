import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render } from '@testing-library/react'
import { act } from '@testing-library/react'
import ResultsPage from '../ResultsPage'
import { useGameStore } from '../../stores/gameStore'
import { createEstadoJuego, createJugador } from '../../test/mocks/mockGameState'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

// Mock api
vi.mock('../../services/api', () => ({
  obtenerEstado: vi.fn(),
}))

// Mock storage
vi.mock('../../utils/storage', () => ({
  clearSession: vi.fn(),
  loadSession: vi.fn(() => null),
}))

import * as api from '../../services/api'
import * as storage from '../../utils/storage'

const jugador1 = createJugador({ id: 'jugador-1', nombre: 'Carlos', puntosTotales: 25 })
const jugador2 = createJugador({ id: 'jugador-2', nombre: 'Ana', puntosTotales: 50 })

const finalizadaState = createEstadoJuego({
  partidaId: 'partida-1',
  estado: 'FINALIZADA',
  ganadorId: 'jugador-1',
  jugadores: [jugador1, jugador2],
})

function renderResultsPage(partidaId = 'partida-1') {
  return render(
    <MemoryRouter initialEntries={[`/results/${partidaId}`]}>
      <Routes>
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ResultsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useGameStore.setState({
        ...useGameStore.getInitialState(),
        partidaId: 'partida-1',
        jugadorId: 'jugador-1',
        nombreJugador: 'Carlos',
        estado: finalizadaState,
      })
    })
    vi.mocked(api.obtenerEstado).mockResolvedValue(finalizadaState)
  })

  it('shows "Ganaste!" when current player is the winner', () => {
    renderResultsPage()
    expect(screen.getByText(/Ganaste!/)).toBeInTheDocument()
  })

  it('shows "Fin de la partida" when current player is not the winner', () => {
    act(() => {
      useGameStore.setState({
        jugadorId: 'jugador-2',
      })
    })
    renderResultsPage()
    expect(screen.getByText(/Fin de la partida/)).toBeInTheDocument()
  })

  it('shows winner name and total points', () => {
    renderResultsPage()
    const winnerInfo = screen.getByText((_content, element) => {
      return element?.tagName === 'P' && !!element?.textContent?.includes('Carlos') && !!element?.textContent?.includes('25 puntos')
    })
    expect(winnerInfo).toBeInTheDocument()
  })

  it('renders Scoreboard with all players', () => {
    renderResultsPage()
    expect(screen.getByText('Tabla de puntos')).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('shows points for all players in scoreboard', () => {
    renderResultsPage()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('"Nueva partida" button clears session and navigates to /', async () => {
    const user = userEvent.setup()
    renderResultsPage()

    await user.click(screen.getByText('Nueva partida'))

    expect(storage.clearSession).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/')

    const state = useGameStore.getState()
    expect(state.partidaId).toBeNull()
    expect(state.jugadorId).toBeNull()
  })

  it('fetches estado on mount', async () => {
    renderResultsPage()

    await waitFor(() => {
      expect(api.obtenerEstado).toHaveBeenCalledWith('partida-1')
    })
  })

  it('restores session from localStorage when partidaId is not in store', () => {
    act(() => {
      useGameStore.setState({
        ...useGameStore.getInitialState(),
        partidaId: null,
        jugadorId: null,
        estado: finalizadaState,
      })
    })
    vi.mocked(storage.loadSession).mockReturnValue({
      partidaId: 'partida-1',
      jugadorId: 'jugador-1',
      nombreJugador: 'Carlos',
    })

    renderResultsPage()

    const state = useGameStore.getState()
    expect(state.partidaId).toBe('partida-1')
    expect(state.jugadorId).toBe('jugador-1')
  })
})
