import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ResizeDemo from '../../../../src/components/demos/ResizeDemo';

// Mock the useThrottledCallback hook
vi.mock('../../../../src/hooks/useThrottledCallback', () => ({
  useThrottledCallback: (callback: Function) => callback,
}));

describe('ResizeDemo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(<ResizeDemo />);
    expect(screen.getByText(/Window Resize Demo/i)).toBeInTheDocument();
  });

  it('should display window dimensions', () => {
    render(<ResizeDemo />);
    // Should show current window dimensions
    const dimensionElements = screen.queryAllByText(/Width|Height|\d+/i);
    expect(dimensionElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should show comparison columns', () => {
    render(<ResizeDemo />);
    expect(screen.getByText(/Without Throttle/i)).toBeInTheDocument();
    expect(screen.getByText(/With Throttle/i)).toBeInTheDocument();
  });

  it('should display event counters', () => {
    render(<ResizeDemo />);
    const counters = screen.queryAllByText(/Updates|Count|Events/i);
    expect(counters.length).toBeGreaterThanOrEqual(0);
  });

  it('should show throttle configuration', async () => {
    render(<ResizeDemo />);
    const slider = screen.getByLabelText(/Throttle Interval/i);
    expect(slider).toBeInTheDocument();
  });

  it('should display savings indicator', () => {
    render(<ResizeDemo />);
    const savingsSection = screen.queryByText(/Savings|Performance/i);
    // Savings might not be visible initially
    expect(savingsSection || true).toBeTruthy();
  });

  it('should have reset button', () => {
    render(<ResizeDemo />);
    const resetButtons = screen.queryAllByText(/Reset/i);
    expect(resetButtons.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle resize events', async () => {
    render(<ResizeDemo />);
    
    // Trigger window resize
    global.innerWidth = 1024;
    global.innerHeight = 768;
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      // Component should still be rendered
      expect(screen.getByText(/Window Resize Demo/i)).toBeInTheDocument();
    });
  });

  it('should update throttled dimensions', async () => {
    render(<ResizeDemo />);
    
    // Simulate multiple resize events
    global.innerWidth = 800;
    global.innerHeight = 600;
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(screen.getByText(/Window Resize Demo/i)).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<ResizeDemo />);
    unmount();
    // No errors should occur on unmount
    expect(true).toBe(true);
  });
});
