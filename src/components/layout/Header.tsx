import { useState } from 'react';
import './Header.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">⚡ Debounce & Throttle Tutorial</h1>
          <p className="app-subtitle">Interactive Learning Experience</p>
        </div>
        <div className="header-actions">
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
