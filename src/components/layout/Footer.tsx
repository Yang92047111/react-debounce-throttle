import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                React Docs
              </a>
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Events"
                target="_blank"
                rel="noopener noreferrer"
              >
                MDN Event Reference
              </a>
            </li>
            <li>
              <a
                href="https://lodash.com/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lodash Documentation
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Learn More</h3>
          <ul>
            <li>
              <a href="#theory">Theory & Concepts</a>
            </li>
            <li>
              <a href="#demos">Interactive Demos</a>
            </li>
            <li>
              <a href="#comparison">Comparison Table</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Project</h3>
          <ul>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </li>
            <li>Built with React + Vite + TypeScript</li>
            <li>&copy; 2026 Educational Project</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
