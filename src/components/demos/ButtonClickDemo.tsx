import { useState } from 'react';
import { useThrottledCallback } from '../../hooks/useThrottledCallback';
import EventCounter from '../ui/EventCounter';

const ButtonClickDemo = () => {
  const [normalCount, setNormalCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [throttleInterval, setThrottleInterval] = useState(1000);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [showBlockedFeedback, setShowBlockedFeedback] = useState(false);

  const handleNormalClick = () => {
    setNormalCount((prev) => prev + 1);
  };

  const handleThrottledClick = useThrottledCallback(
    () => {
      setThrottledCount((prev) => prev + 1);
      setLastClickTime(Date.now());
    },
    throttleInterval,
    []
  );

  const handleThrottledButtonClick = () => {
    const now = Date.now();
    if (lastClickTime && now - lastClickTime < throttleInterval) {
      setBlockedCount((prev) => prev + 1);
      setShowBlockedFeedback(true);
      setTimeout(() => setShowBlockedFeedback(false), 300);
    }
    handleThrottledClick();
  };

  const handleReset = () => {
    setNormalCount(0);
    setThrottledCount(0);
    setBlockedCount(0);
    setLastClickTime(null);
  };

  return (
    <div className="button-click-demo demo-section">
      <div className="demo-header">
        <h2>Button Click Demo (Throttle)</h2>
        <p>Click the buttons rapidly to see how throttle protects against excessive clicks</p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label htmlFor="button-throttle-interval">
            Throttle Interval: {throttleInterval}ms
          </label>
          <input
            id="button-throttle-interval"
            type="range"
            min="0"
            max="3000"
            step="100"
            value={throttleInterval}
            onChange={(e) => setThrottleInterval(Number(e.target.value))}
            className="slider"
          />
        </div>

        <button onClick={handleReset} className="reset-button">
          Reset All
        </button>
      </div>

      <div className="demo-comparison">
        <div className="comparison-column">
          <h3>Normal Button</h3>
          <button 
            className="demo-button demo-button-normal"
            onClick={handleNormalClick}
          >
            Click Me!
          </button>
          <EventCounter
            label="Total Clicks"
            count={normalCount}
            color="danger"
          />
          <div className="button-info">
            <p>✗ No protection against rapid clicks</p>
            <p>✗ Can cause performance issues</p>
            <p>✗ May trigger duplicate actions</p>
          </div>
        </div>

        <div className="comparison-column">
          <h3>Throttled Button</h3>
          <button 
            className={`demo-button demo-button-throttled ${showBlockedFeedback ? 'blocked' : ''}`}
            onClick={handleThrottledButtonClick}
          >
            Click Me!
          </button>
          {showBlockedFeedback && (
            <div className="blocked-feedback">
              Click Blocked!
            </div>
          )}
          <EventCounter
            label="Successful Clicks"
            count={throttledCount}
            color="success"
          />
          <EventCounter
            label="Blocked Clicks"
            count={blockedCount}
            color="warning"
          />
          <div className="button-info">
            <p>✓ Limits click rate</p>
            <p>✓ Prevents performance issues</p>
            <p>✓ Avoids duplicate submissions</p>
          </div>
        </div>

        <div className="comparison-column">
          <h3>Statistics</h3>
          <div className="stats-display">
            <div className="stat-card">
              <div className="stat-label">Total Attempts</div>
              <div className="stat-value">{normalCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Processed</div>
              <div className="stat-value stat-success">{throttledCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Prevented</div>
              <div className="stat-value stat-warning">{blockedCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Protection Rate</div>
              <div className="stat-value stat-info">
                {normalCount > 0 
                  ? `${Math.round((blockedCount / normalCount) * 100)}%`
                  : '0%'}
              </div>
            </div>
          </div>
          <div className="rate-limit-info">
            <div className="rate-limit-label">Current Rate Limit</div>
            <div className="rate-limit-value">
              {throttleInterval > 0 
                ? `${Math.round(1000 / throttleInterval)} clicks/sec`
                : 'Unlimited'}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-use-cases">
        <h3>Common Use Cases</h3>
        <div className="use-case-grid">
          <div className="use-case-card">
            <div className="use-case-icon">💾</div>
            <div className="use-case-title">Form Submission</div>
            <div className="use-case-description">
              Prevent duplicate form submissions
            </div>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">🛒</div>
            <div className="use-case-title">Add to Cart</div>
            <div className="use-case-description">
              Avoid adding items multiple times
            </div>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">👍</div>
            <div className="use-case-title">Like/Vote Buttons</div>
            <div className="use-case-description">
              Prevent vote spamming
            </div>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">📧</div>
            <div className="use-case-title">Send Message</div>
            <div className="use-case-description">
              Avoid sending duplicate messages
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonClickDemo;
