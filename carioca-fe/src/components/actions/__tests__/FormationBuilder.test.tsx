import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import FormationBuilder from '../FormationBuilder'
import { useGameStore } from '../../../stores/gameStore'
import { createCarta } from '../../../test/mocks/mockGameState'

// Cartas de prueba con tres 7s (pierna válida) y tres 4s (segunda pierna)
const seisCartas = [
  createCarta({ id: 'c1', valor: '7', palo: 'CORAZONES', notacion: '7C' }),
  createCarta({ id: 'c2', valor: '7', palo: 'DIAMANTES', notacion: '7D' }),
  createCarta({ id: 'c3', valor: '7', palo: 'TREBOLES', notacion: '7T' }),
  createCarta({ id: 'c4', valor: '4', palo: 'CORAZONES', notacion: '4C' }),
  createCarta({ id: 'c5', valor: '4', palo: 'DIAMANTES', notacion: '4D' }),
  createCarta({ id: 'c6', valor: '4', palo: 'TREBOLES', notacion: '4T' }),
]

const mockBajar = vi.fn()

vi.mock('../../../hooks/useGameActions', () => ({
  useGameActions: () => ({
    bajar: mockBajar,
    descartar: vi.fn(),
    robar: vi.fn(),
    pegar: vi.fn(),
    refresh: vi.fn(),
  }),
}))

function setStoreOpen(cardIds: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']) {
  useGameStore.setState({
    showFormationBuilder: true,
    selectedCardIds: cardIds,
    misCartas: seisCartas,
    loading: false,
  })
}

describe('FormationBuilder', () => {
  beforeEach(() => {
    mockBajar.mockReset()
    useGameStore.setState({
      showFormationBuilder: false,
      selectedCardIds: [],
      misCartas: [],
      loading: false,
    })
  })

  // -------------------------------------------------------------------------
  // Visibilidad
  // -------------------------------------------------------------------------

  it('no renderiza nada cuando showFormationBuilder es false', () => {
    useGameStore.setState({ showFormationBuilder: false })
    const { container } = render(<FormationBuilder />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza el modal cuando showFormationBuilder es true', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    expect(screen.getByText('Bajar formaciones')).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Pool de cartas disponibles
  // -------------------------------------------------------------------------

  it('muestra las cartas del pool seleccionadas', () => {
    setStoreOpen(['c1', 'c2', 'c3'])
    render(<FormationBuilder />)
    // Las cartas de la mano que están en selectedCardIds y no asignadas aparecen en el pool
    expect(screen.getByText(/Cartas disponibles/)).toBeInTheDocument()
  })

  it('no muestra cartas disponibles si no hay ninguna seleccionada', () => {
    setStoreOpen([])
    render(<FormationBuilder />)
    expect(screen.queryByText('Cartas disponibles')).not.toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Selector de tipo de formación
  // -------------------------------------------------------------------------

  it('muestra botones para seleccionar tipo Pierna y Escalera', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    expect(screen.getByText('Pierna')).toBeInTheDocument()
    expect(screen.getByText('Escalera')).toBeInTheDocument()
  })

  it('tipo Pierna está seleccionado por defecto', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    const piernaBtn = screen.getByText('Pierna')
    expect(piernaBtn.className).toContain('bg-blue-600')
    const escaleraBtn = screen.getByText('Escalera')
    expect(escaleraBtn.className).not.toContain('bg-blue-600')
  })

  it('cambia el tipo al hacer click en Escalera', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    fireEvent.click(screen.getByText('Escalera'))
    const escaleraBtn = screen.getByText('Escalera')
    expect(escaleraBtn.className).toContain('bg-blue-600')
  })

  // -------------------------------------------------------------------------
  // Botón Cancelar
  // -------------------------------------------------------------------------

  it('el botón Cancelar cierra el modal', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(useGameStore.getState().showFormationBuilder).toBe(false)
  })

  // -------------------------------------------------------------------------
  // Botón Confirmar
  // -------------------------------------------------------------------------

  it('el botón Confirmar está deshabilitado cuando no hay formaciones armadas', () => {
    setStoreOpen(['c1', 'c2']) // menos de 3 cartas, no alcanza para una formación
    render(<FormationBuilder />)
    const confirmarBtn = screen.getByRole('button', { name: /Confirmar/i })
    expect(confirmarBtn).toBeDisabled()
  })

  it('el botón Confirmar está habilitado cuando la formación actual tiene 3+ cartas', () => {
    setStoreOpen(['c1', 'c2', 'c3'])
    render(<FormationBuilder />)

    // Cada click saca la carta del pool (se mueve a formación actual),
    // por eso siempre clickeamos children[0] (el siguiente pasa a índice 0)
    const poolHeading = screen.getByText(/Cartas disponibles/)
    const flexContainer = poolHeading.nextElementSibling!
    fireEvent.click(flexContainer.children[0]) // c1 → formación actual
    fireEvent.click(flexContainer.children[0]) // c2 → formación actual
    fireEvent.click(flexContainer.children[0]) // c3 → formación actual

    const confirmarBtn = screen.getByRole('button', { name: /Confirmar/i })
    expect(confirmarBtn).not.toBeDisabled()
  })

  it('Confirmar llama a bajar con las cartas de la formación actual', async () => {
    mockBajar.mockResolvedValue(undefined)
    setStoreOpen(['c1', 'c2', 'c3'])
    render(<FormationBuilder />)

    // Mover 3 cartas del pool a la formación actual
    const poolHeading = screen.getByText(/Cartas disponibles/)
    const flexContainer = poolHeading.nextElementSibling!
    fireEvent.click(flexContainer.children[0]) // c1
    fireEvent.click(flexContainer.children[0]) // c2
    fireEvent.click(flexContainer.children[0]) // c3

    fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

    await waitFor(() => {
      expect(mockBajar).toHaveBeenCalledWith([
        { tipo: 'PIERNA', cartaIds: ['c1', 'c2', 'c3'] },
      ])
    })
  })

  // -------------------------------------------------------------------------
  // Flujo: agregar formación al listado
  // -------------------------------------------------------------------------

  it('el botón "+ Agregar al listado" aparece cuando hay cartas en el pool', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    expect(screen.getByText('+ Agregar al listado')).toBeInTheDocument()
  })

  it('el botón "+ Agregar al listado" está deshabilitado sin cartas en la formación actual', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    // La formación actual está vacía (aún no se hizo click en ninguna carta del pool)
    const agregarBtn = screen.getByText('+ Agregar al listado')
    expect(agregarBtn).toBeDisabled()
  })

  // -------------------------------------------------------------------------
  // Título de la formación actual cambia con las ya armadas
  // -------------------------------------------------------------------------

  it('muestra "Formación actual:" cuando no hay formaciones previas', () => {
    setStoreOpen()
    render(<FormationBuilder />)
    expect(screen.getByText(/Formación actual:/)).toBeInTheDocument()
    expect(screen.queryByText(/#2/)).not.toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Estado disabled cuando loading
  // -------------------------------------------------------------------------

  it('el botón Confirmar está deshabilitado cuando loading es true', () => {
    useGameStore.setState({
      showFormationBuilder: true,
      selectedCardIds: ['c1', 'c2', 'c3'],
      misCartas: seisCartas,
      loading: true,
    })
    render(<FormationBuilder />)
    const confirmarBtn = screen.getByRole('button', { name: /Confirmar/i })
    expect(confirmarBtn).toBeDisabled()
  })

  // -------------------------------------------------------------------------
  // Reset al abrir
  // -------------------------------------------------------------------------

  it('resetea el estado al abrirse de nuevo', () => {
    // Abrir con cartas
    setStoreOpen(['c1', 'c2', 'c3'])
    const { unmount } = render(<FormationBuilder />)
    unmount()

    // Cerrar y volver a abrir
    useGameStore.setState({ showFormationBuilder: false })
    useGameStore.setState({
      showFormationBuilder: true,
      selectedCardIds: ['c4', 'c5', 'c6'],
      misCartas: seisCartas,
    })
    render(<FormationBuilder />)

    // El listado de formaciones armadas debe estar vacío (sin sección "Listas para bajar")
    expect(screen.queryByText(/Listas para bajar/)).not.toBeInTheDocument()
  })
})
