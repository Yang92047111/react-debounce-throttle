import './ComparisonTable.css';

const ComparisonTable = () => {
  const comparisonData = [
    {
      aspect: 'Execution Timing',
      debounce: 'After inactivity period ends',
      throttle: 'At regular intervals during activity',
    },
    {
      aspect: 'Execution Count',
      debounce: 'Once per activity burst',
      throttle: 'Multiple times at fixed rate',
    },
    {
      aspect: 'Use Case',
      debounce: 'Search inputs, form validation, auto-save',
      throttle: 'Scroll handlers, mouse tracking, button clicks',
    },
    {
      aspect: 'Pattern',
      debounce: 'Wait then execute once',
      throttle: 'Execute periodically',
    },
    {
      aspect: 'Leading Edge',
      debounce: 'Optional: execute on first call',
      throttle: 'Typically executes immediately',
    },
    {
      aspect: 'Trailing Edge',
      debounce: 'Always executes after delay',
      throttle: 'Optional: execute on final call',
    },
    {
      aspect: 'Best For',
      debounce: 'User completes an action',
      throttle: 'Ongoing activity needs monitoring',
    },
    {
      aspect: 'Performance Impact',
      debounce: 'Minimal - executes least frequently',
      throttle: 'Moderate - executes at controlled rate',
    },
  ];

  return (
    <section id="comparison" className="comparison-section">
      <h2>⚖️ Debounce vs Throttle Comparison</h2>

      <div className="comparison-table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th className="debounce-col">🕒 Debounce</th>
              <th className="throttle-col">⏱️ Throttle</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index}>
                <td className="aspect-cell">{row.aspect}</td>
                <td className="debounce-cell">{row.debounce}</td>
                <td className="throttle-cell">{row.throttle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-summary">
        <div className="summary-card debounce-summary">
          <h4>🎯 When to Use Debounce</h4>
          <p>
            Choose debounce when you want to wait for the user to <strong>finish</strong>{' '}
            an action before responding. Perfect for scenarios where only the final
            result matters.
          </p>
          <div className="examples">
            <span className="example-tag">Search</span>
            <span className="example-tag">Validation</span>
            <span className="example-tag">Auto-save</span>
          </div>
        </div>

        <div className="summary-card throttle-summary">
          <h4>🎯 When to Use Throttle</h4>
          <p>
            Choose throttle when you want <strong>consistent updates</strong> during
            continuous activity. Perfect for scenarios where periodic feedback is
            important.
          </p>
          <div className="examples">
            <span className="example-tag">Scrolling</span>
            <span className="example-tag">Resizing</span>
            <span className="example-tag">Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
