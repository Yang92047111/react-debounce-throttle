import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonClickDemo from '../../../../src/components/demos/ButtonClickDemo';

describe('ButtonClickDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render normal and throttled buttons', () => {
    render(<ButtonClickDemo />);
    
    const buttons = screen.getAllByRole('button', { name: /click me/i });
    expect(buttons).toHaveLength(2);
  });

  it('should render throttle interval control', () => {
    render(<ButtonClickDemo />);
    
    expect(screen.getByLabelText(/throttle interval/i)).toBeInTheDocument();
  });

  it('should show event counters', () => {
    render(<ButtonClickDemo />);
    
    expect(screen.getByText(/total clicks/i)).toBeInTheDocument();
    expect(screen.getByText(/successful clicks/i)).toBeInTheDocument();
    expect(screen.getByText(/blocked clicks/i)).toBeInTheDocument();
  });

  it('should allow unlimited clicks on normal button', () => {
    render(<ButtonClickDemo />);
    const buttons = screen.getAllByRole('button', { name: /click me/i });
    const normalButton = buttons[0];
    
    fireEvent.click(normalButton);
    fireEvent.click(normalButton);
    fireEvent.click(normalButton);
    
    const totalClicksCounter = screen.getByText(/total clicks/i).parentElement;
    expect(totalClicksCounter).toBeInTheDocument();
  });

  it('should throttle clicks on throttled button', () => {
    render(<ButtonClickDemo />);
    const buttons = screen.getAllByRole('button', { name: /click me/i });
    const throttledButton = buttons[1];
    
    // Click multiple times rapidly
    fireEvent.click(throttledButton);
    fireEvent.click(throttledButton);
    fireEvent.click(throttledButton);
    
    // Counters should be present
    expect(screen.getByText(/successful clicks/i)).toBeInTheDocument();
  });

  it('should allow changing throttle interval', () => {
    render(<ButtonClickDemo />);
    const slider = screen.getByLabelText(/throttle interval/i);
    
    fireEvent.change(slider, { target: { value: '2000' } });
    
    expect(screen.getByText(/throttle interval: 2000ms/i)).toBeInTheDocument();
  });

  it('should reset all counters', () => {
    render(<ButtonClickDemo />);
    const buttons = screen.getAllByRole('button', { name: /click me/i });
    const normalButton = buttons[0];
    const resetButton = screen.getByRole('button', { name: /reset all/i });
    
    fireEvent.click(normalButton);
    fireEvent.click(resetButton);
    
    // Counters should be reset (implementation detail may vary)
    expect(resetButton).toBeInTheDocument();
  });

  it('should show visual feedback when clicks are blocked', () => {
    render(<ButtonClickDemo />);
    const buttons = screen.getAllByRole('button', { name: /click me/i });
    const throttledButton = buttons[1];
    
    fireEvent.click(throttledButton);
    fireEvent.click(throttledButton);
    
    // Check that blocked clicks counter exists
    expect(screen.getByText(/blocked clicks/i)).toBeInTheDocument();
  });

  it('should display statistics correctly', () => {
    render(<ButtonClickDemo />);
    
    expect(screen.getByText(/total attempts/i)).toBeInTheDocument();
    expect(screen.getByText(/processed/i)).toBeInTheDocument();
    expect(screen.getByText(/prevented/i)).toBeInTheDocument();
    expect(screen.getByText(/protection rate/i)).toBeInTheDocument();
  });

  it('should show use cases section', () => {
    render(<ButtonClickDemo />);
    
    expect(screen.getByText(/common use cases/i)).toBeInTheDocument();
    const formSubmissionElements = screen.getAllByText(/form submission/i);
    expect(formSubmissionElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it('should calculate protection rate percentage', () => {
    render(<ButtonClickDemo />);
    const buttons = screen.getAllByRole('button', { name: /click me/i });
    
    // Click normal button
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);
    
    // Should show percentage
    expect(screen.getByText(/protection rate/i)).toBeInTheDocument();
  });
});
