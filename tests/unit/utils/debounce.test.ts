import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../../../src/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should execute only once after rapid calls', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should respect leading edge option', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100, { leading: true, trailing: false });

    debouncedFunc();
    expect(func).toHaveBeenCalledTimes(1);

    debouncedFunc();
    debouncedFunc();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should respect trailing edge option', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100, { leading: false, trailing: true });

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should respect both leading and trailing edge options', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100, { leading: true, trailing: true });

    debouncedFunc();
    expect(func).toHaveBeenCalledTimes(1); // Leading edge

    debouncedFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2); // Trailing edge

    vi.advanceTimersByTime(100);

    debouncedFunc();
    expect(func).toHaveBeenCalledTimes(3); // Leading edge again

    vi.advanceTimersByTime(100);
    // No 4th call because there was only one call and no trailing call needed
    expect(func).toHaveBeenCalledTimes(3);
  });

  it('should handle maxWait option', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100, { maxWait: 200 });

    debouncedFunc();
    vi.advanceTimersByTime(50);

    debouncedFunc();
    vi.advanceTimersByTime(50);

    debouncedFunc();
    vi.advanceTimersByTime(50);

    debouncedFunc();
    vi.advanceTimersByTime(50);

    // maxWait of 200ms has been reached
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.cancel();

    vi.advanceTimersByTime(100);
    expect(func).not.toHaveBeenCalled();
  });

  it('should flush pending execution immediately', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.flush();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('arg1', 'arg2', 123);

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('should use latest arguments when multiple calls are made', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('first');
    debouncedFunc('second');
    debouncedFunc('third');

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('third');
  });

  it('should not execute if cancelled', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc.cancel();
    vi.advanceTimersByTime(100);

    expect(func).not.toHaveBeenCalled();
  });

  it('should handle zero delay', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 0);

    debouncedFunc();

    vi.advanceTimersByTime(0);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
