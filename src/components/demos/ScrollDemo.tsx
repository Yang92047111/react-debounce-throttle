import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useThrottle } from '../../hooks/useThrottle';
import EventCounter from '../ui/EventCounter';

const ScrollDemo = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [debouncedCount, setDebouncedCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);
  const [debounceDelay, setDebounceDelay] = useState(300);
  const [throttleInterval, setThrottleInterval] = useState(100);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const debouncedScrollPosition = useDebounce(scrollPosition, debounceDelay);
  const throttledScrollPosition = useThrottle(scrollPosition, throttleInterval);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const position = scrollRef.current.scrollTop;
        setScrollPosition(position);
        setNormalCount((prev) => prev + 1);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (debouncedScrollPosition > 0) {
      setDebouncedCount((prev) => prev + 1);
    }
  }, [debouncedScrollPosition]);

  useEffect(() => {
    if (throttledScrollPosition > 0) {
      setThrottledCount((prev) => prev + 1);
    }
  }, [throttledScrollPosition]);

  const handleReset = () => {
    setNormalCount(0);
    setDebouncedCount(0);
    setThrottledCount(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const getScrollPercentage = (position: number) => {
    if (!scrollRef.current) return 0;
    const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    return maxScroll > 0 ? Math.round((position / maxScroll) * 100) : 0;
  };

  return (
    <div className="scroll-demo demo-section">
      <div className="demo-header">
        <h2>Scroll Event Demo (Debounce vs Throttle)</h2>
        <p>Scroll the content area below to compare different optimization strategies</p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label htmlFor="scroll-debounce-delay">
            Debounce Delay: {debounceDelay}ms
          </label>
          <input
            id="scroll-debounce-delay"
            type="range"
            min="0"
            max="1000"
            step="50"
            value={debounceDelay}
            onChange={(e) => setDebounceDelay(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label htmlFor="scroll-throttle-interval">
            Throttle Interval: {throttleInterval}ms
          </label>
          <input
            id="scroll-throttle-interval"
            type="range"
            min="0"
            max="1000"
            step="50"
            value={throttleInterval}
            onChange={(e) => setThrottleInterval(Number(e.target.value))}
            className="slider"
          />
        </div>

        <button onClick={handleReset} className="reset-button">
          Reset All
        </button>
      </div>

      <div className="scroll-container" ref={scrollRef}>
        <div className="scroll-content">
          <h3>Scrollable Content</h3>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>
              Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </div>
      </div>

      <div className="demo-comparison">
        <div className="comparison-column">
          <h3>No Optimization</h3>
          <div className="position-display">
            <div className="position-value">{scrollPosition.toFixed(0)}px</div>
            <div className="position-label">Scroll Position</div>
            <div className="progress-bar">
              <div 
                className="progress-fill progress-danger" 
                style={{ width: `${getScrollPercentage(scrollPosition)}%` }}
              />
            </div>
          </div>
          <EventCounter
            label="Handler Executions"
            count={normalCount}
            color="danger"
          />
        </div>

        <div className="comparison-column">
          <h3>With Debounce</h3>
          <div className="position-display">
            <div className="position-value">{debouncedScrollPosition.toFixed(0)}px</div>
            <div className="position-label">Scroll Position</div>
            <div className="progress-bar">
              <div 
                className="progress-fill progress-primary" 
                style={{ width: `${getScrollPercentage(debouncedScrollPosition)}%` }}
              />
            </div>
          </div>
          <EventCounter
            label="Handler Executions"
            count={debouncedCount}
            color="primary"
          />
          <div className="strategy-note">
            Updates after scrolling stops
          </div>
        </div>

        <div className="comparison-column">
          <h3>With Throttle</h3>
          <div className="position-display">
            <div className="position-value">{throttledScrollPosition.toFixed(0)}px</div>
            <div className="position-label">Scroll Position</div>
            <div className="progress-bar">
              <div 
                className="progress-fill progress-success" 
                style={{ width: `${getScrollPercentage(throttledScrollPosition)}%` }}
              />
            </div>
          </div>
          <EventCounter
            label="Handler Executions"
            count={throttledCount}
            color="success"
          />
          <div className="strategy-note">
            Updates at regular intervals
          </div>
        </div>

        <div className="comparison-column">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-label">Total Events</div>
              <div className="stat-value">{normalCount}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Debounce Savings</div>
              <div className="stat-value stat-success">
                {normalCount - debouncedCount}
                <span className="stat-percentage">
                  ({normalCount > 0 ? Math.round(((normalCount - debouncedCount) / normalCount) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Throttle Savings</div>
              <div className="stat-value stat-success">
                {normalCount - throttledCount}
                <span className="stat-percentage">
                  ({normalCount > 0 ? Math.round(((normalCount - throttledCount) / normalCount) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollDemo;
