import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import EventCounter from '../ui/EventCounter';

const SearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [normalCount, setNormalCount] = useState(0);
  const [debouncedCount, setDebouncedCount] = useState(0);
  const [debounceDelay, setDebounceDelay] = useState(500);
  const [loading, setLoading] = useState(false);
  const [normalResults, setNormalResults] = useState<string[]>([]);
  const [debouncedResults, setDebouncedResults] = useState<string[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Simulate API call without debounce
  const handleNormalSearch = (value: string) => {
    setNormalCount((prev) => prev + 1);
    // Simulate API call
    const results = value ? [`Result 1 for "${value}"`, `Result 2 for "${value}"`] : [];
    setNormalResults(results);
  };

  // Simulate API call with debounce
  const handleDebouncedSearch = useCallback((value: string) => {
    setDebouncedCount((prev) => prev + 1);
    setLoading(true);
    // Simulate API latency
    setTimeout(() => {
      const results = value ? [`Result 1 for "${value}"`, `Result 2 for "${value}"`] : [];
      setDebouncedResults(results);
      setLoading(false);
    }, 300);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleNormalSearch(value);
  };

  // Effect for debounced search
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleDebouncedSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, handleDebouncedSearch]);

  const handleReset = () => {
    setSearchTerm('');
    setNormalCount(0);
    setDebouncedCount(0);
    setNormalResults([]);
    setDebouncedResults([]);
  };

  return (
    <div className="search-demo demo-section">
      <div className="demo-header">
        <h2>Search Input Demo (Debounce)</h2>
        <p>Type in the search box to see how debounce optimizes API calls</p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label htmlFor="search-input">Search:</label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Start typing..."
            className="search-input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="debounce-delay">
            Debounce Delay: {debounceDelay}ms
          </label>
          <input
            id="debounce-delay"
            type="range"
            min="0"
            max="2000"
            step="100"
            value={debounceDelay}
            onChange={(e) => setDebounceDelay(Number(e.target.value))}
            className="slider"
          />
        </div>

        <button onClick={handleReset} className="reset-button">
          Reset All
        </button>
      </div>

      <div className="demo-comparison">
        <div className="comparison-column">
          <h3>Without Debounce</h3>
          <div className="api-indicator api-indicator-danger">
            API Call on Every Keystroke
          </div>
          <EventCounter
            label="API Calls Made"
            count={normalCount}
            color="danger"
          />
          <div className="results-box">
            {normalResults.length > 0 ? (
              <ul>
                {normalResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            ) : (
              <p className="no-results">Type to see results...</p>
            )}
          </div>
        </div>

        <div className="comparison-column">
          <h3>With Debounce</h3>
          <div className={`api-indicator ${loading ? 'api-indicator-warning' : 'api-indicator-success'}`}>
            {loading ? 'Loading...' : 'API Call After Delay'}
          </div>
          <EventCounter
            label="API Calls Made"
            count={debouncedCount}
            color="success"
          />
          <div className="results-box">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : debouncedResults.length > 0 ? (
              <ul>
                {debouncedResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            ) : (
              <p className="no-results">Type to see results...</p>
            )}
          </div>
        </div>

        <div className="comparison-column">
          <h3>Comparison</h3>
          <div className="savings-indicator">
            <div className="savings-value">
              {normalCount - debouncedCount}
            </div>
            <div className="savings-label">API Calls Saved</div>
          </div>
          <div className="savings-percentage">
            {normalCount > 0
              ? `${Math.round(((normalCount - debouncedCount) / normalCount) * 100)}% Reduction`
              : '0% Reduction'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDemo;
