import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from '@/components/error/ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary level="component">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Component Error')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('should render page-level error UI for page errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary level="page">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('should call onError callback when provided', () => {
    const onError = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
    
    consoleSpy.mockRestore()
  })

  it('should retry when retry button is clicked', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Create a component that can toggle error state
    let shouldThrow = true
    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>No error</div>
    }

    const { rerender } = render(
      <ErrorBoundary level="component">
        <ToggleError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Component Error')).toBeInTheDocument()

    const retryButton = screen.getByRole('button')

    // Change the error state before clicking retry
    shouldThrow = false

    await user.click(retryButton)

    // The error boundary should reset and show the non-error component
    expect(screen.getByText('No error')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
