import { useState } from 'react';
import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
}

const CodeBlock = ({
  code,
  language = 'typescript',
  title,
  showCopy = true,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-block">
      {(title || showCopy) && (
        <div className="code-header">
          {title && <span className="code-title">{title}</span>}
          {showCopy && (
            <button
              className="copy-button"
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          )}
        </div>
      )}
      <pre className={`code-content language-${language}`}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
