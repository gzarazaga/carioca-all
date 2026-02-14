import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render } from '@testing-library/react'
import { act } from '@testing-library/react'
import HomePage from '../HomePage'
import { useGameStore } from '../../stores/gameStore'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

// Mock api
vi.mock('../../services/api', () => ({
  crearPartida: vi.fn(),
  unirsePartida: vi.fn(),
  obtenerEstado: vi.fn(),
}))

// Mock storage
vi.mock('../../utils/storage', () => ({
  saveSession: vi.fn(),
  loadSession: vi.fn(() => null),
  clearSession: vi.fn(),
}))

import * as api from '../../services/api'
import * as storage from '../../utils/storage'

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useGameStore.setState(useGameStore.getInitialState())
    })
    vi.mocked(storage.loadSession).mockReturnValue(null)
  })

  it('renders title "Carioca" and form fields', () => {
    renderHomePage()
    expect(screen.getByText(/Carioca/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingresa tu nombre')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Codigo de partida')).toBeInTheDocument()
    expect(screen.getByText('Crear nueva partida')).toBeInTheDocument()
    expect(screen.getByText('Unirse')).toBeInTheDocument()
  })

  describe('name validation', () => {
    it('shows error toast when name is less than 2 characters on create', async () => {
      const user = userEvent.setup()
      renderHomePage()

      const nameInput = screen.getByPlaceholderText('Ingresa tu nombre')
      await user.type(nameInput, 'A')
      await user.click(screen.getByText('Crear nueva partida'))

      const toasts = useGameStore.getState().toasts
      expect(toasts.some((t) => t.text.includes('al menos 2 caracteres'))).toBe(true)
    })

    it('shows error toast when name is empty on join', async () => {
      const user = userEvent.setup()
      renderHomePage()

      const codeInput = screen.getByPlaceholderText('Codigo de partida')
      await user.type(codeInput, 'ABC123')
      await user.click(screen.getByText('Unirse'))

      const toasts = useGameStore.getState().toasts
      expect(toasts.some((t) => t.text.includes('al menos 2 caracteres'))).toBe(true)
    })
  })

  describe('crear partida', () => {
    it('calls crearPartida API and navigates to lobby', async () => {
      const user = userEvent.setup()
      vi.mocked(api.crearPartida).mockResolvedValue({
        partidaId: 'p-123',
        jugadorId: 'j-456',
        nombreJugador: 'Carlos',
        mensaje: 'OK',
      })

      renderHomePage()

      await user.type(screen.getByPlaceholderText('Ingresa tu nombre'), 'Carlos')
      await user.click(screen.getByText('Crear nueva partida'))

      await waitFor(() => {
        expect(api.crearPartida).toHaveBeenCalledWith('Carlos')
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/lobby/p-123')
      })

      const state = useGameStore.getState()
      expect(state.partidaId).toBe('p-123')
      expect(state.jugadorId).toBe('j-456')
      expect(state.nombreJugador).toBe('Carlos')
      expect(storage.saveSession).toHaveBeenCalled()
    })

    it('shows error toast on API failure', async () => {
      const user = userEvent.setup()
      vi.mocked(api.crearPartida).mockRejectedValue(new Error('Server error'))

      renderHomePage()

      await user.type(screen.getByPlaceholderText('Ingresa tu nombre'), 'Carlos')
      await user.click(screen.getByText('Crear nueva partida'))

      await waitFor(() => {
        const toasts = useGameStore.getState().toasts
        expect(toasts.some((t) => t.text === 'Server error')).toBe(true)
      })
    })
  })

  describe('unirse a partida', () => {
    it('calls unirsePartida API with code and name, then navigates', async () => {
      const user = userEvent.setup()
      vi.mocked(api.unirsePartida).mockResolvedValue({
        partidaId: 'p-ABC',
        jugadorId: 'j-789',
        nombreJugador: 'Ana',
        mensaje: 'OK',
      })

      renderHomePage()

      await user.type(screen.getByPlaceholderText('Ingresa tu nombre'), 'Ana')
      await user.type(screen.getByPlaceholderText('Codigo de partida'), 'p-ABC')
      await user.click(screen.getByText('Unirse'))

      await waitFor(() => {
        expect(api.unirsePartida).toHaveBeenCalledWith('p-ABC', 'Ana')
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/lobby/p-ABC')
      })
    })

    it('shows error toast when code is empty', async () => {
      const user = userEvent.setup()
      renderHomePage()

      await user.type(screen.getByPlaceholderText('Ingresa tu nombre'), 'Carlos')
      await user.click(screen.getByText('Unirse'))

      const toasts = useGameStore.getState().toasts
      expect(toasts.some((t) => t.text.includes('codigo'))).toBe(true)
    })

    it('shows error toast on API failure', async () => {
      const user = userEvent.setup()
      vi.mocked(api.unirsePartida).mockRejectedValue(new Error('Partida no encontrada'))

      renderHomePage()

      await user.type(screen.getByPlaceholderText('Ingresa tu nombre'), 'Ana')
      await user.type(screen.getByPlaceholderText('Codigo de partida'), 'INVALID')
      await user.click(screen.getByText('Unirse'))

      await waitFor(() => {
        const toasts = useGameStore.getState().toasts
        expect(toasts.some((t) => t.text === 'Partida no encontrada')).toBe(true)
      })
    })
  })

  describe('rejoin banner', () => {
    it('shows rejoin banner when session exists in localStorage', () => {
      vi.mocked(storage.loadSession).mockReturnValue({
        partidaId: 'p-old',
        jugadorId: 'j-old',
        nombreJugador: 'PrevPlayer',
      })

      renderHomePage()

      expect(screen.getByText(/Tienes una partida en curso/)).toBeInTheDocument()
      expect(screen.getByText('PrevPlayer')).toBeInTheDocument()
      expect(screen.getByText('Volver a la partida')).toBeInTheDocument()
    })

    it('does not show rejoin banner when no session', () => {
      renderHomePage()
      expect(screen.queryByText(/Tienes una partida en curso/)).not.toBeInTheDocument()
    })

    it('navigates to game when rejoin for EN_CURSO game', async () => {
      const user = userEvent.setup()
      vi.mocked(storage.loadSession).mockReturnValue({
        partidaId: 'p-old',
        jugadorId: 'j-old',
        nombreJugador: 'PrevPlayer',
      })
      vi.mocked(api.obtenerEstado).mockResolvedValue({
        partidaId: 'p-old',
        estado: 'EN_CURSO',
        numeroRonda: 1,
        descripcionRonda: '2 Piernas',
        estadoTurno: 'ESPERANDO_ROBAR',
        jugadorActualId: 'j-old',
        jugadorActualNombre: 'PrevPlayer',
        cartasEnMazo: 40,
        cartaSuperiorDescarte: null,
        jugadores: [],
        formacionesEnMesa: [],
        fechaCreacion: '2026-01-01T00:00:00Z',
        fechaInicio: '2026-01-01T00:01:00Z',
        ganadorId: null,
      })

      renderHomePage()
      await user.click(screen.getByText('Volver a la partida'))

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/game/p-old')
      })
    })

    it('navigates to lobby when rejoin for ESPERANDO_JUGADORES game', async () => {
      const user = userEvent.setup()
      vi.mocked(storage.loadSession).mockReturnValue({
        partidaId: 'p-old',
        jugadorId: 'j-old',
        nombreJugador: 'PrevPlayer',
      })
      vi.mocked(api.obtenerEstado).mockResolvedValue({
        partidaId: 'p-old',
        estado: 'ESPERANDO_JUGADORES',
        numeroRonda: 0,
        descripcionRonda: '',
        estadoTurno: null,
        jugadorActualId: null,
        jugadorActualNombre: null,
        cartasEnMazo: 0,
        cartaSuperiorDescarte: null,
        jugadores: [],
        formacionesEnMesa: [],
        fechaCreacion: '2026-01-01T00:00:00Z',
        fechaInicio: null,
        ganadorId: null,
      })

      renderHomePage()
      await user.click(screen.getByText('Volver a la partida'))

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/lobby/p-old')
      })
    })

    it('clears session and shows error when rejoin fails', async () => {
      const user = userEvent.setup()
      vi.mocked(storage.loadSession).mockReturnValue({
        partidaId: 'p-old',
        jugadorId: 'j-old',
        nombreJugador: 'PrevPlayer',
      })
      vi.mocked(api.obtenerEstado).mockRejectedValue(new Error('Not found'))

      renderHomePage()
      await user.click(screen.getByText('Volver a la partida'))

      await waitFor(() => {
        expect(storage.clearSession).toHaveBeenCalled()
      })

      await waitFor(() => {
        const toasts = useGameStore.getState().toasts
        expect(toasts.some((t) => t.text.includes('no encontrada'))).toBe(true)
      })
    })
  })
})
