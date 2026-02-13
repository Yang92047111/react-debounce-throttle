import { useState } from 'react';
import type { DemoConfig } from '../../types';
import './ConfigPanel.css';

interface ConfigPanelProps {
  config: DemoConfig;
  onChange: (config: DemoConfig) => void;
  onReset?: () => void;
}

const ConfigPanel = ({ config, onChange, onReset }: ConfigPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (key: keyof DemoConfig, value: number | boolean) => {
    onChange({ ...config, [key]: value });
  };

  const presets = [
    { name: 'Fast', delay: 100, interval: 100 },
    { name: 'Moderate', delay: 300, interval: 200 },
    { name: 'Slow', delay: 1000, interval: 500 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    onChange({
      ...config,
      delay: preset.delay,
      interval: preset.interval,
    });
  };

  return (
    <div className="config-panel">
      <div className="config-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>⚙️ Configuration Panel</h3>
        <button className="expand-toggle" aria-label="Toggle config panel">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="config-content">
          <div className="config-section">
            <h4>Debounce Settings</h4>
            <div className="config-item">
              <label htmlFor="delay">Delay (ms): {config.delay}</label>
              <input
                id="delay"
                type="range"
                min="0"
                max="2000"
                step="50"
                value={config.delay}
                onChange={(e) => handleChange('delay', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="config-section">
            <h4>Throttle Settings</h4>
            <div className="config-item">
              <label htmlFor="interval">Interval (ms): {config.interval}</label>
              <input
                id="interval"
                type="range"
                min="0"
                max="1000"
                step="50"
                value={config.interval}
                onChange={(e) => handleChange('interval', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="config-section">
            <h4>Advanced Options</h4>
            <div className="config-item checkbox-item">
              <input
                id="leading"
                type="checkbox"
                checked={config.leading}
                onChange={(e) => handleChange('leading', e.target.checked)}
              />
              <label htmlFor="leading">Leading Edge</label>
            </div>
            <div className="config-item checkbox-item">
              <input
                id="trailing"
                type="checkbox"
                checked={config.trailing}
                onChange={(e) => handleChange('trailing', e.target.checked)}
              />
              <label htmlFor="trailing">Trailing Edge</label>
            </div>
            {config.maxWait !== undefined && (
              <div className="config-item">
                <label htmlFor="maxWait">Max Wait (ms): {config.maxWait}</label>
                <input
                  id="maxWait"
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={config.maxWait}
                  onChange={(e) => handleChange('maxWait', Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="config-section">
            <h4>Presets</h4>
            <div className="preset-buttons">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-button"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {onReset && (
            <button className="reset-button" onClick={onReset}>
              Reset to Defaults
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
