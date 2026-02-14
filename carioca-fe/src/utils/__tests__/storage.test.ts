import { describe, it, expect, beforeEach } from 'vitest'
import { saveSession, loadSession, clearSession } from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saveSession + loadSession roundtrip works', () => {
    const session = {
      partidaId: 'game-123',
      jugadorId: 'player-456',
      nombreJugador: 'Gonzalo',
    }

    saveSession(session)
    const loaded = loadSession()

    expect(loaded).toEqual(session)
  })

  it('loadSession returns null when no data exists', () => {
    expect(loadSession()).toBeNull()
  })

  it('clearSession removes the stored data', () => {
    saveSession({
      partidaId: 'game-123',
      jugadorId: 'player-456',
      nombreJugador: 'Gonzalo',
    })

    clearSession()

    expect(loadSession()).toBeNull()
  })

  it('loadSession returns null for corrupted data', () => {
    localStorage.setItem('carioca_session', 'not-valid-json{{{')
    expect(loadSession()).toBeNull()
  })
})