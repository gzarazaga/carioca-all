import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Toast from '../Toast'
import { useGameStore } from '../../../stores/gameStore'

describe('Toast', () => {
  beforeEach(() => {
    useGameStore.setState({ toasts: [] })
  })

  it('renders nothing when there are no toasts', () => {
    const { container } = render(<Toast />)
    expect(container.firstChild).toBeNull()
  })

  it('renders toast message', () => {
    useGameStore.setState({
      toasts: [{ id: 1, text: 'Carta robada!', type: 'info' }],
    })

    render(<Toast />)
    expect(screen.getByText('Carta robada!')).toBeInTheDocument()
  })

  it('renders multiple toasts', () => {
    useGameStore.setState({
      toasts: [
        { id: 1, text: 'Mensaje 1', type: 'info' },
        { id: 2, text: 'Mensaje 2', type: 'success' },
      ],
    })

    render(<Toast />)
    expect(screen.getByText('Mensaje 1')).toBeInTheDocument()
    expect(screen.getByText('Mensaje 2')).toBeInTheDocument()
  })

  it('shows info style for info type', () => {
    useGameStore.setState({
      toasts: [{ id: 1, text: 'Info toast', type: 'info' }],
    })

    render(<Toast />)
    const toast = screen.getByText('Info toast').closest('div[class*="bg-"]')
    expect(toast?.className).toContain('bg-blue-600')
  })

  it('shows success style for success type', () => {
    useGameStore.setState({
      toasts: [{ id: 1, text: 'Success toast', type: 'success' }],
    })

    render(<Toast />)
    const toast = screen.getByText('Success toast').closest('div[class*="bg-"]')
    expect(toast?.className).toContain('bg-green-600')
  })

  it('shows error style for error type', () => {
    useGameStore.setState({
      toasts: [{ id: 1, text: 'Error toast', type: 'error' }],
    })

    render(<Toast />)
    const toast = screen.getByText('Error toast').closest('div[class*="bg-"]')
    expect(toast?.className).toContain('bg-red-600')
  })

  it('close button removes the toast', () => {
    useGameStore.setState({
      toasts: [{ id: 1, text: 'Toast to close', type: 'info' }],
    })

    render(<Toast />)
    expect(screen.getByText('Toast to close')).toBeInTheDocument()

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    // After clicking close, the toast should be removed from the store
    const toasts = useGameStore.getState().toasts
    expect(toasts).toHaveLength(0)
  })

  it('close button only removes the target toast', () => {
    useGameStore.setState({
      toasts: [
        { id: 1, text: 'First toast', type: 'info' },
        { id: 2, text: 'Second toast', type: 'error' },
      ],
    })

    render(<Toast />)
    const closeButtons = screen.getAllByRole('button')
    // Click the first close button
    fireEvent.click(closeButtons[0])

    const toasts = useGameStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].text).toBe('Second toast')
  })
})