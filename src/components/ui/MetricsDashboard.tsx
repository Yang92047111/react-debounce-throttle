import type { MetricData } from '../../types';
import './MetricsDashboard.css';

interface MetricsDashboardProps {
  metrics: MetricData[];
  onReset?: () => void;
}

const MetricsDashboard = ({ metrics, onReset }: MetricsDashboardProps) => {
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;

  const calculateReduction = () => {
    if (!latestMetrics || latestMetrics.normalCount === 0) return 0;
    const reduction =
      ((latestMetrics.normalCount - latestMetrics.optimizedCount) /
        latestMetrics.normalCount) *
      100;
    return Math.round(reduction);
  };

  const calculateAverageFrequency = (count: number) => {
    if (!latestMetrics || metrics.length === 0) return 0;
    const duration =
      (latestMetrics.timestamp - metrics[0].timestamp) / 1000 || 1;
    return Math.round((count / duration) * 10) / 10;
  };

  return (
    <div className="metrics-dashboard">
      <div className="dashboard-header">
        <h3>📊 Performance Metrics</h3>
        {onReset && (
          <button className="dashboard-reset" onClick={onReset}>
            Reset Metrics
          </button>
        )}
      </div>

      {latestMetrics ? (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Normal Execution</div>
            <div className="metric-value normal">{latestMetrics.normalCount}</div>
            <div className="metric-sub">
              {calculateAverageFrequency(latestMetrics.normalCount)} calls/sec
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Optimized Execution</div>
            <div className="metric-value optimized">
              {latestMetrics.optimizedCount}
            </div>
            <div className="metric-sub">
              {calculateAverageFrequency(latestMetrics.optimizedCount)} calls/sec
            </div>
          </div>

          <div className="metric-card highlight">
            <div className="metric-label">Reduction</div>
            <div className="metric-value reduction">{calculateReduction()}%</div>
            <div className="metric-sub">
              {latestMetrics.normalCount - latestMetrics.optimizedCount} fewer
              calls
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Performance Gain</div>
            <div className="metric-value gain">
              {latestMetrics.normalCount > 0
                ? `${Math.round((latestMetrics.normalCount / (latestMetrics.optimizedCount || 1)) * 10) / 10}x`
                : '0x'}
            </div>
            <div className="metric-sub">Efficiency multiplier</div>
          </div>
        </div>
      ) : (
        <div className="no-metrics">
          <p>No metrics available yet. Interact with the demos to see performance data.</p>
        </div>
      )}
    </div>
  );
};

export default MetricsDashboard;
