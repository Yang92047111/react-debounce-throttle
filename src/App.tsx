import { useState } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import TheorySection from './components/education/TheorySection';
import ComparisonTable from './components/education/ComparisonTable';
import TimelineDiagram from './components/education/TimelineDiagram';
import ConfigPanel from './components/ui/ConfigPanel';
import MetricsDashboard from './components/ui/MetricsDashboard';
import SearchDemo from './components/demos/SearchDemo';
import ResizeDemo from './components/demos/ResizeDemo';
import ScrollDemo from './components/demos/ScrollDemo';
import ButtonClickDemo from './components/demos/ButtonClickDemo';
import type { DemoConfig, MetricData } from './types';
import './App.css';
import './styles/demos.css';

function App() {
  const [activeSection, setActiveSection] = useState('theory');
  const [config, setConfig] = useState<DemoConfig>({
    delay: 300,
    interval: 200,
    leading: false,
    trailing: true,
    maxWait: 1000,
  });
  const [metrics, setMetrics] = useState<MetricData[]>([]);

  const handleConfigChange = (newConfig: DemoConfig) => {
    setConfig(newConfig);
  };

  const handleResetConfig = () => {
    setConfig({
      delay: 300,
      interval: 200,
      leading: false,
      trailing: true,
      maxWait: 1000,
    });
  };

  const handleResetMetrics = () => {
    setMetrics([]);
  };

  return (
    <div className="app">
      <Header />
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="main-content">
        <TheorySection />
        <TimelineDiagram />
        <ComparisonTable />

        <section id="config" className="config-section">
          <ConfigPanel
            config={config}
            onChange={handleConfigChange}
            onReset={handleResetConfig}
          />
        </section>

        <section id="demos" className="demos-section">
          <h2>🎮 Interactive Demos</h2>
          <SearchDemo />
          <ResizeDemo />
          <ScrollDemo />
          <ButtonClickDemo />
        </section>

        <section id="metrics" className="metrics-section">
          <MetricsDashboard metrics={metrics} onReset={handleResetMetrics} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
