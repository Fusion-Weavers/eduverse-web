import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Loading topics..." />);
    expect(screen.getByText('Loading topics...')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(document.querySelector('.spinner-small')).toBeInTheDocument();

    rerender(<LoadingSpinner size="large" />);
    expect(document.querySelector('.spinner-large')).toBeInTheDocument();
  });

  it('renders with different colors', () => {
    render(<LoadingSpinner color="success" />);
    expect(document.querySelector('.spinner-success')).toBeInTheDocument();
  });

  it('renders with progress when showProgress is true', () => {
    render(<LoadingSpinner showProgress={true} progress={50} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders as overlay when overlay prop is true', () => {
    render(<LoadingSpinner overlay={true} />);
    expect(document.querySelector('.loading-spinner-overlay')).toBeInTheDocument();
  });
});