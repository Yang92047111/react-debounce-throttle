/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - The options object
 * @param options.leading - Specify invoking on the leading edge of the timeout
 * @param options.trailing - Specify invoking on the trailing edge of the timeout
 * @returns Returns the new throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T> | undefined;

  const leading = options?.leading ?? true;
  const trailing = options?.trailing ?? true;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result!;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the throttle limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= wait
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (trailing && lastArgs) {
      invokeFunc(time);
    }
    timeoutId = undefined;
    lastArgs = undefined;
    lastThis = undefined;
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    // Reset any throttle timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timeoutId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastInvoke = time - lastInvokeTime;
    return wait - timeSinceLastInvoke;
  }

  function trailingEdge(time: number): void {
    timeoutId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // throttled at least once.
    if (trailing && lastArgs) {
      invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
  }

  function cancel(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastCallTime = undefined;
    lastArgs = undefined;
    lastThis = undefined;
    timeoutId = undefined;
  }

  function flush(): void {
    if (timeoutId === undefined) {
      return;
    }
    const time = Date.now();
    trailingEdge(time);
  }

  function throttled(this: any, ...args: Parameters<T>): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime) as any;
      }
    }
    if (timeoutId === undefined && trailing) {
      timeoutId = setTimeout(timerExpired, wait);
    }
  }

  throttled.cancel = cancel;
  throttled.flush = flush;

  return throttled;
}
