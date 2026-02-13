import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchDemo from '../../../../src/components/demos/SearchDemo';

describe('SearchDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render the search input and controls', () => {
    render(<SearchDemo />);
    
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/debounce delay/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset all/i })).toBeInTheDocument();
  });

  it('should show event counters', () => {
    render(<SearchDemo />);
    
    const counters = screen.getAllByText(/api calls made/i);
    expect(counters).toHaveLength(2);
  });

  it('should increment normal counter on every keystroke', () => {
    render(<SearchDemo />);
    const input = screen.getByLabelText(/search/i);
    
    fireEvent.change(input, { target: { value: 'h' } });
    fireEvent.change(input, { target: { value: 'he' } });
    fireEvent.change(input, { target: { value: 'hel' } });
    
    const counters = screen.getAllByText(/api calls made/i);
    expect(counters).toHaveLength(2); // One for without debounce, one for with debounce
  });

  it('should debounce API calls', () => {
    render(<SearchDemo />);
    const input = screen.getByLabelText(/search/i);
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Both counters should be visible
    expect(screen.getAllByText(/api calls made/i)).toHaveLength(2);
  });

  it('should allow changing debounce delay', () => {
    render(<SearchDemo />);
    const slider = screen.getByLabelText(/debounce delay/i);
    
    fireEvent.change(slider, { target: { value: '1000' } });
    
    expect(screen.getByText(/debounce delay: 1000ms/i)).toBeInTheDocument();
  });

  it('should reset all counters and input', () => {
    render(<SearchDemo />);
    const input = screen.getByLabelText(/search/i);
    const resetButton = screen.getByRole('button', { name: /reset all/i });
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(resetButton);
    
    expect(input).toHaveValue('');
  });

  it('should show results for search term', () => {
    render(<SearchDemo />);
    const input = screen.getByLabelText(/search/i);
    
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(screen.getByText(/result 1 for "test query"/i)).toBeInTheDocument();
    expect(screen.getByText(/result 2 for "test query"/i)).toBeInTheDocument();
  });

  it('should show loading indicator during debounced search', () => {
    render(<SearchDemo />);
    const input = screen.getByLabelText(/search/i);
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Loading indicator should appear (there are two elements with "loading")
    const loadingElements = screen.getAllByText(/loading/i);
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should calculate and display API call savings', () => {
    render(<SearchDemo />);
    const input = screen.getByLabelText(/search/i);
    
    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.change(input, { target: { value: 'te' } });
    fireEvent.change(input, { target: { value: 'tes' } });
    
    expect(screen.getByText(/api calls saved/i)).toBeInTheDocument();
  });
});
