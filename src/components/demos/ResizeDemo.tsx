import { useState, useEffect } from 'react';
import { useThrottle } from '../../hooks/useThrottle';
import EventCounter from '../ui/EventCounter';

const ResizeDemo = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [normalCount, setNormalCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);
  const [throttleInterval, setThrottleInterval] = useState(200);
  
  const throttledWindowSize = useThrottle(windowSize, throttleInterval);

  useEffect(() => {
    const handleResize = () => {
      setNormalCount((prev) => prev + 1);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setThrottledCount((prev) => prev + 1);
  }, [throttledWindowSize]);

  const handleReset = () => {
    setNormalCount(0);
    setThrottledCount(0);
  };

  return (
    <div className="resize-demo demo-section">
      <div className="demo-header">
        <h2>Window Resize Demo (Throttle)</h2>
        <p>Resize your browser window to see how throttle limits event handler execution</p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label htmlFor="throttle-interval">
            Throttle Interval: {throttleInterval}ms
          </label>
          <input
            id="throttle-interval"
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
          Reset Counters
        </button>
      </div>

      <div className="demo-comparison">
        <div className="comparison-column">
          <h3>Without Throttle</h3>
          <div className="dimension-display">
            <div className="dimension-label">Width</div>
            <div className="dimension-value">{windowSize.width}px</div>
          </div>
          <div className="dimension-display">
            <div className="dimension-label">Height</div>
            <div className="dimension-value">{windowSize.height}px</div>
          </div>
          <EventCounter
            label="Updates Triggered"
            count={normalCount}
            color="danger"
          />
        </div>

        <div className="comparison-column">
          <h3>With Throttle</h3>
          <div className="dimension-display">
            <div className="dimension-label">Width</div>
            <div className="dimension-value">{throttledWindowSize.width}px</div>
          </div>
          <div className="dimension-display">
            <div className="dimension-label">Height</div>
            <div className="dimension-value">{throttledWindowSize.height}px</div>
          </div>
          <EventCounter
            label="Updates Triggered"
            count={throttledCount}
            color="success"
          />
        </div>

        <div className="comparison-column">
          <h3>Performance Gain</h3>
          <div className="savings-indicator">
            <div className="savings-value">
              {normalCount - throttledCount}
            </div>
            <div className="savings-label">Updates Prevented</div>
          </div>
          <div className="savings-percentage">
            {normalCount > 0
              ? `${Math.round(((normalCount - throttledCount) / normalCount) * 100)}% Reduction`
              : '0% Reduction'}
          </div>
          <div className="frequency-indicator">
            <div className="frequency-label">Current Frequency</div>
            <div className="frequency-value">
              {throttleInterval > 0 ? `~${Math.round(1000 / throttleInterval)}/sec` : 'Unlimited'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizeDemo;
