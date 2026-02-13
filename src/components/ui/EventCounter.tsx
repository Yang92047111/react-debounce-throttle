import './EventCounter.css';

interface EventCounterProps {
  label: string;
  count: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showReset?: boolean;
  onReset?: () => void;
}

const EventCounter = ({
  label,
  count,
  color = 'primary',
  showReset = false,
  onReset,
}: EventCounterProps) => {
  return (
    <div className={`event-counter event-counter-${color}`}>
      <div className="counter-label">{label}</div>
      <div className="counter-value">{count}</div>
      {showReset && onReset && (
        <button className="counter-reset" onClick={onReset}>
          Reset
        </button>
      )}
    </div>
  );
};

export default EventCounter;
