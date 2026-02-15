import { useCallback, useEffect, useRef, DependencyList } from 'react';
import { debounce } from '../utils/debounce';

/**
 * Hook that returns a debounced version of a callback function.
 * 
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependency array for the callback
 * @param options - Debounce options (leading, trailing, maxWait)
 * @returns The debounced callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    debouncedRef.current = debounce(memoizedCallback, delay, options);

    return () => {
      debouncedRef.current?.cancel();
    };
  }, [memoizedCallback, delay, options]);

  return debouncedRef.current || debounce(memoizedCallback, delay, options);
}
