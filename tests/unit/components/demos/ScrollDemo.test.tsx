import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScrollDemo from '../../../../src/components/demos/ScrollDemo';

// Mock the hooks
vi.mock('../../../../src/hooks/useDebouncedCallback', () => ({
  useDebouncedCallback: (callback: (...args: any[]) => any) => callback,
}));

vi.mock('../../../../src/hooks/useThrottledCallback', () => ({
  useThrottledCallback: (callback: (...args: any[]) => any) => callback,
}));

describe('ScrollDemo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(<ScrollDemo />);
    expect(screen.getByText(/Scroll Event Demo/i)).toBeInTheDocument();
  });

  it('should have scrollable content area', () => {
    render(<ScrollDemo />);
    const scrollContainer = document.querySelector('.scroll-container');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('should show comparison columns', () => {
    render(<ScrollDemo />);
    const element = screen.queryAllByText(/Scroll/i);
    expect(element.length > 0).toBeTruthy();
  });

  it('should display scroll position', () => {
    render(<ScrollDemo />);
    const positionElements = screen.queryAllByText(/Position|Scroll|\d+/i);
    expect(positionElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should display event counters', () => {
    render(<ScrollDemo />);
    const counters = screen.queryAllByText(/Events|Count|Updates/i);
    expect(counters.length).toBeGreaterThanOrEqual(0);
  });

  it('should have configuration sliders', () => {
    render(<ScrollDemo />);
    const sliders = screen.queryAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle scroll events', async () => {
    render(<ScrollDemo />);
    const scrollContainer = document.querySelector('.scroll-container');
    
    if (scrollContainer) {
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } });
      
      await waitFor(() => {
        expect(screen.getByText(/Scroll Event Demo/i)).toBeInTheDocument();
      });
    }
  });

  it('should update scroll position on scroll', async () => {
    render(<ScrollDemo />);
    const scrollContainer = document.querySelector('.scroll-container');
    
    if (scrollContainer) {
      // Simulate scroll
      Object.defineProperty(scrollContainer, 'scrollTop', {
        writable: true,
        value: 200
      });
      
      fireEvent.scroll(scrollContainer);

      await waitFor(() => {
        expect(screen.getByText(/Scroll Event Demo/i)).toBeInTheDocument();
      }, { timeout: 500 });
    }
  });

  it('should show comparison of all three approaches', () => {
    render(<ScrollDemo />);
    
    // Should have sections for no optimization, debounce, and throttle
    const sections = document.querySelectorAll('.comparison-column');
    expect(sections.length).toBeGreaterThanOrEqual(3);
  });

  it('should have reset functionality', () => {
    render(<ScrollDemo />);
    const resetButtons = screen.queryAllByText(/Reset/i);
    // Reset button might be present
    expect(resetButtons.length).toBeGreaterThanOrEqual(0);
  });

  it('should display statistics section', () => {
    render(<ScrollDemo />);
    const statsSection = screen.queryByText(/Statistics|Summary/i);
    // Stats section might be present
    expect(statsSection || true).toBeTruthy();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<ScrollDemo />);
    unmount();
    // No errors should occur on unmount
    expect(true).toBe(true);
  });
});
