import { useState } from 'react';
import './TimelineDiagram.css';

type DiagramType = 'debounce' | 'throttle';

const TimelineDiagram = () => {
  const [activeType, setActiveType] = useState<DiagramType>('debounce');

  return (
    <section className="timeline-section">
      <h2>📈 Visual Timeline</h2>

      <div className="diagram-controls">
        <button
          className={`diagram-button ${activeType === 'debounce' ? 'active' : ''}`}
          onClick={() => setActiveType('debounce')}
        >
          🕒 Debounce Timeline
        </button>
        <button
          className={`diagram-button ${activeType === 'throttle' ? 'active' : ''}`}
          onClick={() => setActiveType('throttle')}
        >
          ⏱️ Throttle Timeline
        </button>
      </div>

      <div className="timeline-container">
        {activeType === 'debounce' && (
          <div className="timeline-diagram debounce-diagram">
            <h3>Debounce: Wait for Inactivity</h3>
            <p className="diagram-description">
              Function executes only after the specified delay following the last event.
              Each new event resets the timer.
            </p>

            <div className="timeline">
              <div className="timeline-header">
                <span className="timeline-label">Events:</span>
                <div className="timeline-track">
                  <div className="event-marker" style={{ left: '10%' }}>
                    <div className="event-dot"></div>
                    <span className="event-label">1</span>
                  </div>
                  <div className="event-marker" style={{ left: '25%' }}>
                    <div className="event-dot"></div>
                    <span className="event-label">2</span>
                  </div>
                  <div className="event-marker" style={{ left: '35%' }}>
                    <div className="event-dot"></div>
                    <span className="event-label">3</span>
                  </div>
                  <div className="event-marker" style={{ left: '42%' }}>
                    <div className="event-dot"></div>
                    <span className="event-label">4</span>
                  </div>
                  <div className="event-marker" style={{ left: '75%' }}>
                    <div className="event-dot"></div>
                    <span className="event-label">5</span>
                  </div>
                </div>
              </div>

              <div className="timeline-header execution">
                <span className="timeline-label">Executes:</span>
                <div className="timeline-track">
                  <div className="execution-marker debounce-execution" style={{ left: '58%' }}>
                    <div className="execution-pulse"></div>
                    <span className="execution-label">✓</span>
                  </div>
                  <div className="execution-marker debounce-execution" style={{ left: '91%' }}>
                    <div className="execution-pulse"></div>
                    <span className="execution-label">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-legend">
              <div className="legend-item">
                <div className="legend-dot event"></div>
                <span>User Event</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot execution"></div>
                <span>Function Execution</span>
              </div>
            </div>
          </div>
        )}

        {activeType === 'throttle' && (
          <div className="timeline-diagram throttle-diagram">
            <h3>Throttle: Regular Intervals</h3>
            <p className="diagram-description">
              Function executes at most once per specified interval, regardless of how
              many events occur.
            </p>

            <div className="timeline">
              <div className="timeline-header">
                <span className="timeline-label">Events:</span>
                <div className="timeline-track">
                  {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(
                    (pos, idx) => (
                      <div key={idx} className="event-marker" style={{ left: `${pos}%` }}>
                        <div className="event-dot small"></div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="timeline-header execution">
                <span className="timeline-label">Executes:</span>
                <div className="timeline-track">
                  <div className="execution-marker throttle-execution" style={{ left: '10%' }}>
                    <div className="execution-pulse"></div>
                    <span className="execution-label">✓</span>
                  </div>
                  <div className="execution-marker throttle-execution" style={{ left: '35%' }}>
                    <div className="execution-pulse"></div>
                    <span className="execution-label">✓</span>
                  </div>
                  <div className="execution-marker throttle-execution" style={{ left: '60%' }}>
                    <div className="execution-pulse"></div>
                    <span className="execution-label">✓</span>
                  </div>
                  <div className="execution-marker throttle-execution" style={{ left: '85%' }}>
                    <div className="execution-pulse"></div>
                    <span className="execution-label">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-legend">
              <div className="legend-item">
                <div className="legend-dot event"></div>
                <span>User Event</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot execution"></div>
                <span>Function Execution</span>
              </div>
              <div className="legend-item">
                <div className="legend-interval"></div>
                <span>Time Interval</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineDiagram;
