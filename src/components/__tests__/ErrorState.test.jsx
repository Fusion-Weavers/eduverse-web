import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('renders with default props', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    render(
      <ErrorState 
        title="Custom Error" 
        message="Custom error message" 
      />
    );
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders retry button when showRetry is true and onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorState onRetry={mockRetry} showRetry={true} />);
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it('renders reload button when showReload is true', () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(<ErrorState showReload={true} />);
    
    const reloadButton = screen.getByText('Reload Page');
    expect(reloadButton).toBeInTheDocument();
    
    fireEvent.click(reloadButton);
    expect(mockReload).toHaveBeenCalledOnce();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<ErrorState variant="network" />);
    expect(document.querySelector('.error-state-network')).toBeInTheDocument();

    rerender(<ErrorState variant="notFound" />);
    expect(document.querySelector('.error-state-not-found')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<ErrorState size="small" />);
    expect(document.querySelector('.error-state-small')).toBeInTheDocument();

    rerender(<ErrorState size="large" />);
    expect(document.querySelector('.error-state-large')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<ErrorState icon="🔥" />);
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });
});