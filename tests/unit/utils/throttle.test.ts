import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from '../../../src/utils/throttle';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should limit execution rate', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc();
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should execute at specified intervals', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(100);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(3);
  });

  it('should respect leading edge option', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100, { leading: true, trailing: false });

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should respect trailing edge option', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100, { leading: false, trailing: true });

    throttledFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should respect both leading and trailing edge options', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100, { leading: true, trailing: true });

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should handle immediate execution', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc.cancel();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should flush pending execution immediately', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc.flush();

    expect(func).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments correctly', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc('arg1', 'arg2', 123);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('should use latest arguments for trailing call', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc('first');
    expect(func).toHaveBeenCalledWith('first');

    throttledFunc('second');
    throttledFunc('third');

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith('third');
  });

  it('should not execute trailing call if cancelled', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc.cancel();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple invocations over time', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc(); // t=0, executed immediately
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50); // t=50
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50); // t=100, trailing executes
    expect(func).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(50); // t=150
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(3); // Executes immediately (>100ms since last)

    vi.advanceTimersByTime(50); // t=200
  });

  it('should handle zero interval', () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 0);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    vi.advanceTimersByTime(0);
    expect(func).toHaveBeenCalledTimes(2);
  });
});
