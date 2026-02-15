import { useState, useEffect, useRef } from 'react';

/**
 * Hook that returns a throttled value.
 * The value will update at most once per the specified interval.
 * 
 * @param value - The value to throttle
 * @param interval - The interval in milliseconds
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      // If enough time has passed, update immediately
      lastExecuted.current = now;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThrottledValue(value);
    } else {
      // Otherwise, schedule an update for the remaining time
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}
