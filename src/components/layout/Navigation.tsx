import { useState } from 'react';
import './Navigation.css';

interface NavigationProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

const Navigation = ({ activeSection = 'theory', onNavigate }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'theory', label: '📚 Theory', href: '#theory' },
    { id: 'comparison', label: '⚖️ Comparison', href: '#comparison' },
    { id: 'demos', label: '🎮 Demos', href: '#demos' },
    { id: 'config', label: '⚙️ Configuration', href: '#config' },
    { id: 'metrics', label: '📊 Metrics', href: '#metrics' },
  ];

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      <button
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </button>
      <ul className={`nav-list ${isOpen ? 'nav-open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.id);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
