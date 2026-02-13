import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useThrottle } from '../../../src/hooks/useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should throttle value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 'initial', interval: 100 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', interval: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('updated');
  });

  it('should update at regular intervals', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 0, interval: 100 },
      }
    );

    expect(result.current).toBe(0);

    act(() => {
      rerender({ value: 1, interval: 100 });
    });

    // First change updates immediately since enough time has passed
    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(1);

    act(() => {
      rerender({ value: 2, interval: 100 });
    });

    expect(result.current).toBe(1); // Throttled

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(2);
  });

  it('should handle rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 0, interval: 100 },
      }
    );

    expect(result.current).toBe(0);

    for (let i = 1; i <= 10; i++) {
      act(() => {
        rerender({ value: i, interval: 100 });
      });
    }

    // Initial value should still be 0
    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should update to the last value after interval
    expect(result.current).toBe(10);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 'test', interval: 100 },
      }
    );

    unmount();
    // Should not throw any errors
    act(() => {
      vi.advanceTimersByTime(100);
    });
  });

  it('should handle different interval values', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 'initial', interval: 100 },
      }
    );

    act(() => {
      vi.advanceTimersByTime(100); // Advance past the initial lastExecuted time
    });

    act(() => {
      rerender({ value: 'updated', interval: 200 });
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // After 200ms it should update
    expect(result.current).toBe('updated');
  });

  it('should work with different types', () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 0, interval: 100 },
      }
    );

    act(() => {
      numberRerender({ value: 42, interval: 100 });
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(numberResult.current).toBe(42);

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: { count: 0 }, interval: 100 },
      }
    );

    act(() => {
      objectRerender({ value: { count: 5 }, interval: 100 });
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(objectResult.current).toEqual({ count: 5 });
  });

  it('should handle boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: false, interval: 100 },
      }
    );

    expect(result.current).toBe(false);

    act(() => {
      rerender({ value: true, interval: 100 });
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);

    act(() => {
      rerender({ value: false, interval: 100 });
    });

    expect(result.current).toBe(true); // Throttled

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(false);
  });

  it('should handle zero interval', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 'initial', interval: 0 },
      }
    );

    act(() => {
      rerender({ value: 'updated', interval: 0 });
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('should update immediately on first change after interval', () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 0, interval: 100 },
      }
    );

    act(() => {
      rerender({ value: 1, interval: 100 });
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      rerender({ value: 2, interval: 100 });
    });

    // Should update immediately after enough time has passed
    expect(result.current).toBe(2);
  });
});
