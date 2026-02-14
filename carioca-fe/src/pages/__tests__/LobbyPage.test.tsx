import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render } from '@testing-library/react'
import { act } from '@testing-library/react'
import LobbyPage from '../LobbyPage'
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
  iniciarPartida: vi.fn(),
  obtenerCartas: vi.fn(),
}))

// Mock websocket hook
vi.mock('../../hooks/useWebSocket', () => ({
  useWebSocket: vi.fn(() => ({ current: null })),
}))

// Mock storage
vi.mock('../../utils/storage', () => ({
  loadSession: vi.fn(() => null),
}))

import * as api from '../../services/api'
import * as storage from '../../utils/storage'

function renderLobbyPage(partidaId = 'partida-1') {
  return render(
    <MemoryRouter initialEntries={[`/lobby/${partidaId}`]}>
      <Routes>
        <Route path="/lobby/:id" element={<LobbyPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LobbyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useGameStore.setState({
        ...useGameStore.getInitialState(),
        partidaId: 'partida-1',
        jugadorId: 'jugador-1',
        nombreJugador: 'Carlos',
      })
    })
    vi.mocked(api.obtenerEstado).mockResolvedValue(
      createEstadoJuego({
        partidaId: 'partida-1',
        estado: 'ESPERANDO_JUGADORES',
        jugadores: [createJugador({ id: 'jugador-1', nombre: 'Carlos' })],
      }),
    )
  })

  it('renders game code', async () => {
    renderLobbyPage()
    await waitFor(() => {
      expect(screen.getByText('partida-1')).toBeInTheDocument()
    })
  })

  it('shows player list after fetching state', async () => {
    renderLobbyPage()
    await waitFor(() => {
      expect(screen.getByText('Carlos')).toBeInTheDocument()
    })
  })

  it('shows "Iniciar" button disabled with less than 2 players', async () => {
    renderLobbyPage()
    await waitFor(() => {
      const button = screen.getByText('Esperando mas jugadores...')
      expect(button).toBeDisabled()
    })
  })

  it('shows "Iniciar" button enabled with 2+ players', async () => {
    vi.mocked(api.obtenerEstado).mockResolvedValue(
      createEstadoJuego({
        partidaId: 'partida-1',
        estado: 'ESPERANDO_JUGADORES',
        jugadores: [
          createJugador({ id: 'jugador-1', nombre: 'Carlos' }),
          createJugador({ id: 'jugador-2', nombre: 'Ana' }),
        ],
      }),
    )

    renderLobbyPage()
    await waitFor(() => {
      const button = screen.getByText('Iniciar partida')
      expect(button).toBeEnabled()
    })
  })

  it('calls iniciarPartida when start button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(api.obtenerEstado).mockResolvedValue(
      createEstadoJuego({
        partidaId: 'partida-1',
        estado: 'ESPERANDO_JUGADORES',
        jugadores: [
          createJugador({ id: 'jugador-1', nombre: 'Carlos' }),
          createJugador({ id: 'jugador-2', nombre: 'Ana' }),
        ],
      }),
    )
    vi.mocked(api.iniciarPartida).mockResolvedValue(
      createEstadoJuego({
        partidaId: 'partida-1',
        estado: 'EN_CURSO',
      }),
    )

    renderLobbyPage()
    await waitFor(() => {
      expect(screen.getByText('Iniciar partida')).toBeEnabled()
    })
    await user.click(screen.getByText('Iniciar partida'))

    await waitFor(() => {
      expect(api.iniciarPartida).toHaveBeenCalledWith('partida-1')
    })
  })

  it('navigates to /game/:id when estado changes to EN_CURSO', async () => {
    vi.mocked(api.obtenerEstado).mockResolvedValue(
      createEstadoJuego({
        partidaId: 'partida-1',
        estado: 'EN_CURSO',
      }),
    )

    renderLobbyPage()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/game/partida-1')
    })
  })

  it('navigates to /results/:id when estado is FINALIZADA', async () => {
    vi.mocked(api.obtenerEstado).mockResolvedValue(
      createEstadoJuego({
        partidaId: 'partida-1',
        estado: 'FINALIZADA',
      }),
    )

    renderLobbyPage()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/results/partida-1')
    })
  })

  it('redirects to / if no session and route id does not match', () => {
    act(() => {
      useGameStore.setState({
        ...useGameStore.getInitialState(),
        partidaId: null,
        jugadorId: null,
      })
    })
    vi.mocked(storage.loadSession).mockReturnValue(null)

    renderLobbyPage()

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows error toast and navigates home on fetch failure', async () => {
    vi.mocked(api.obtenerEstado).mockRejectedValue(new Error('Network error'))

    renderLobbyPage()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
