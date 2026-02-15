import CodeBlock from '../ui/CodeBlock';
import './TheorySection.css';

const TheorySection = () => {
  const debounceExample = `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`;

  const throttleExample = `function throttle(func, wait) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}`;

  const reactDebounceExample = `// Using debounce in React
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';

function SearchInput() {
  const handleSearch = useDebouncedCallback(
    (query: string) => {
      // API call with debounced query
      fetch(\`/api/search?q=\${query}\`)
        .then(res => res.json())
        .then(data => console.log(data));
    },
    300 // Wait 300ms after user stops typing
  );

  return (
    <input 
      type="text" 
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}`;

  const reactThrottleExample = `// Using throttle in React
import { useThrottledCallback } from '../hooks/useThrottledCallback';

function ScrollTracker() {
  const handleScroll = useThrottledCallback(
    () => {
      // Update scroll position at most once per 200ms
      const scrollY = window.scrollY;
      console.log('Scroll position:', scrollY);
    },
    200 // Execute at most once per 200ms
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>Scroll to see throttled updates</div>;
}`;

  return (
    <section id="theory" className="theory-section">
      <h2>📚 Understanding Debounce & Throttle</h2>

      <div className="theory-grid">
        <div className="theory-card">
          <h3>🕒 Debounce</h3>
          <p className="theory-definition">
            <strong>Debounce</strong> delays the execution of a function until after a
            specified time has elapsed since the last time it was invoked.
          </p>

          <div className="theory-explanation">
            <h4>How it works:</h4>
            <ul>
              <li>Waits for a pause in events before executing</li>
              <li>Resets the timer on each new event</li>
              <li>Executes only after the specified delay of inactivity</li>
            </ul>

            <h4>Common use cases:</h4>
            <ul>
              <li>🔍 Search input fields (wait for user to stop typing)</li>
              <li>📝 Form validation (validate after user finishes input)</li>
              <li>💾 Auto-save features (save after user stops editing)</li>
              <li>📱 Window resize events (recalculate layout after resize ends)</li>
            </ul>
          </div>

          <CodeBlock
            code={debounceExample}
            language="javascript"
            title="Debounce Implementation"
          />

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ color: 'var(--secondary)', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
              React Hook Example:
            </h4>
            <CodeBlock
              code={reactDebounceExample}
              language="typescript"
              title="Using Debounce in React"
            />
          </div>
        </div>

        <div className="theory-card">
          <h3>⏱️ Throttle</h3>
          <p className="theory-definition">
            <strong>Throttle</strong> limits the execution of a function to once per
            specified time interval, regardless of how many times it's called.
          </p>

          <div className="theory-explanation">
            <h4>How it works:</h4>
            <ul>
              <li>Executes immediately on first call</li>
              <li>Ignores subsequent calls until interval passes</li>
              <li>Ensures consistent execution rate</li>
            </ul>

            <h4>Common use cases:</h4>
            <ul>
              <li>🖥️ Scroll event handlers (update position indicator)</li>
              <li>🕹️ Mouse movement tracking</li>
              <li>➡️ Button clicks (prevent multiple submissions)</li>
              <li>📈 Real-time data updates (limit API polling frequency)</li>
            </ul>
          </div>

          <CodeBlock
            code={throttleExample}
            language="javascript"
            title="Throttle Implementation"
          />

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ color: 'var(--secondary)', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
              React Hook Example:
            </h4>
            <CodeBlock
              code={reactThrottleExample}
              language="typescript"
              title="Using Throttle in React"
            />
          </div>
        </div>
      </div>

      <div className="key-differences">
        <h3>🔑 Key Differences</h3>
        <div className="differences-content">
          <div className="difference-item">
            <strong>Execution Pattern:</strong>
            <p>
              Debounce executes <em>after</em> the delay period of inactivity, while
              throttle executes <em>at regular intervals</em> during activity.
            </p>
          </div>
          <div className="difference-item">
            <strong>When to Choose:</strong>
            <p>
              Use <strong>debounce</strong> when you want to wait for the user to finish
              an action. Use <strong>throttle</strong> when you want consistent updates
              during continuous activity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheorySection;
