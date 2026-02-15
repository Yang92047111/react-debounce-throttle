import { useCallback, useEffect, useRef, DependencyList } from 'react';
import { throttle } from '../utils/throttle';

/**
 * Hook that returns a throttled version of a callback function.
 * 
 * @param callback - The callback function to throttle
 * @param interval - The interval in milliseconds
 * @param deps - Dependency array for the callback
 * @param options - Throttle options (leading, trailing)
 * @returns The throttled callback
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number,
  deps: DependencyList,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const throttledRef = useRef<ReturnType<typeof throttle> | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    throttledRef.current = throttle(memoizedCallback, interval, options);

    return () => {
      throttledRef.current?.cancel();
    };
  }, [memoizedCallback, interval, options]);

  return throttledRef.current || throttle(memoizedCallback, interval, options);
}
