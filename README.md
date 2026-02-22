# Debounce and Throttle Tutorial - React Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)

An interactive educational web application that demonstrates the concepts and practical applications of debounce and throttle techniques in React. This project provides hands-on examples, visual feedback, and real-time comparisons to help developers master these essential performance optimization techniques.

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technical Stack](#-technical-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage Examples](#-usage-examples)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

### Purpose

This application serves as a comprehensive learning resource for understanding and implementing debounce and throttle patterns in React applications. It demonstrates:

- **Visual Learning**: See the difference between debounced and throttled events in real-time
- **Practical Examples**: Real-world use cases like search inputs, scroll handlers, and button clicks
- **Performance Insights**: Compare execution counts and optimize your event handlers
- **Best Practices**: Learn when to use debounce vs throttle with interactive examples

### Target Audience

- Frontend developers learning React and performance optimization
- Developers interested in event handling patterns
- Students studying JavaScript and web performance
- Teams looking to optimize their React applications

### Key Learning Objectives

✅ Understand the fundamental difference between debounce and throttle  
✅ Learn when to use each technique in real-world scenarios  
✅ Implement custom debounce and throttle utilities from scratch  
✅ Create reusable React hooks for debouncing and throttling  
✅ Measure and visualize performance improvements  
✅ Apply best practices for event optimization  

## ✨ Features

### Interactive Demos

#### 1. **Search Input Demo** (Debounce)
Demonstrates how debouncing optimizes API calls during user input.
- Live search input with simulated API calls
- Side-by-side comparison: with vs without debounce
- Configurable debounce delay (0-2000ms)
- Real-time event counter
- Visual indicators for API calls

#### 2. **Window Resize Demo** (Throttle)
Shows how throttling reduces excessive event handler executions during window resize.
- Responsive viewport dimension display
- Comparison of throttled vs non-throttled handlers
- Adjustable throttle interval (0-1000ms)
- Event frequency visualization

#### 3. **Scroll Event Demo** (Both)
Compare debounce and throttle side-by-side for scroll events.
- Long scrollable content area
- Four parallel implementations: none, debounced, throttled, and combined
- Scroll position tracking
- Visual feedback on handler execution
- Performance metrics

#### 4. **Button Click Demo** (Throttle)
Prevent rapid button clicks and form submissions.
- Normal vs throttled button comparison
- Click counter for each button
- Visual feedback when clicks are blocked
- Configurable throttle settings

### Educational Content

- **Theory Sections**: Clear explanations of debounce and throttle concepts
- **Visual Diagrams**: Timeline visualizations showing execution patterns
- **Comparison Tables**: Side-by-side feature comparisons
- **Code Examples**: Syntax-highlighted code with copy functionality
- **Best Practices**: Guidelines for choosing the right technique

### Performance Metrics Dashboard

- Real-time execution statistics
- Event count comparisons
- Performance improvement percentages
- Execution frequency graphs
- Resettable metrics

### Configuration Panel

- Global settings for all demos
- Adjustable delays and intervals
- Leading/trailing edge options
- Preset configurations (Fast, Moderate, Slow)
- Reset to defaults

## 🛠️ Technical Stack

### Core Technologies

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript 5.9
- **Styling**: CSS Modules

### Testing Infrastructure

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Coverage**: 80%+ code coverage
- **Test Reports**: HTML coverage reports

### Additional Libraries

- **lodash**: For comparison with custom implementations
- **@types/lodash**: TypeScript definitions

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Vite**: Fast development server and build tool

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

Check your versions:

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/react_debounce_throttle.git
cd react_debounce_throttle
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers** (for E2E testing)

```bash
npx playwright install
```

That's it! You're ready to start developing.

### Running the Application

#### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📖 Usage Examples

### Using the Custom Hooks

#### Debouncing a Value

```typescript
import { useDebounce } from './hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call with debounced value
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### Debouncing a Callback

```typescript
import { useDebouncedCallback } from './hooks/useDebouncedCallback';

function FormComponent() {
  const handleSave = useDebouncedCallback(
    (data) => {
      // Save data to server
      console.log('Saving:', data);
    },
    1000,
    []
  );

  return (
    <button onClick={() => handleSave({ field: 'value' })}>
      Save Changes
    </button>
  );
}
```

#### Throttling a Value

```typescript
import { useThrottle } from './hooks/useThrottle';

function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 200);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll Position: {throttledScrollY}px</div>;
}
```

#### Throttling a Callback

```typescript
import { useThrottledCallback } from './hooks/useThrottledCallback';

function ButtonComponent() {
  const handleClick = useThrottledCallback(
    () => {
      console.log('Button clicked!');
    },
    1000,
    []
  );

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Using the Utility Functions

```typescript
import { debounce, throttle } from './utils';

// Debounce a function
const debouncedFn = debounce((value) => {
  console.log('Debounced:', value);
}, 500);

// Throttle a function
const throttledFn = throttle(() => {
  console.log('Throttled execution');
}, 1000);

// Use them
debouncedFn('hello');
throttledFn();
```

## 🔧 Development Guide

### Project Structure

```
react_debounce_throttle/
├── src/
│   ├── components/
│   │   ├── demos/              # Interactive demo components
│   │   │   ├── ButtonClickDemo.tsx
│   │   │   ├── ResizeDemo.tsx
│   │   │   ├── ScrollDemo.tsx
│   │   │   └── SearchDemo.tsx
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── ConfigPanel.tsx
│   │   │   ├── EventCounter.tsx
│   │   │   └── MetricsDashboard.tsx
│   │   ├── education/          # Educational content
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── TheorySection.tsx
│   │   │   └── TimelineDiagram.tsx
│   │   └── layout/             # Layout components
│   │       ├── Footer.tsx
│   │       ├── Header.tsx
│   │       └── Navigation.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useDebouncedCallback.ts
│   │   ├── useThrottle.ts
│   │   └── useThrottledCallback.ts
│   ├── utils/                  # Utility functions
│   │   ├── debounce.ts
│   │   ├── throttle.ts
│   │   └── performance.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── styles/                 # Global styles
│   │   ├── global.css
│   │   └── demos.css
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
├── tests/
│   ├── unit/                   # Unit tests
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── components/
│   └── e2e/                    # End-to-end tests
│       ├── debounce.spec.ts
│       ├── throttle.spec.ts
│       ├── navigation.spec.ts
│       └── performance.spec.ts
├── spec/                       # Project specification
├── coverage/                   # Test coverage reports
├── playwright-report/          # E2E test reports
└── dist/                       # Production build output
```

### Code Style and Standards

- **TypeScript**: Strict mode enabled
- **Formatting**: ESLint for code quality
- **Naming Conventions**:
  - Components: PascalCase (e.g., `SearchDemo.tsx`)
  - Hooks: camelCase with 'use' prefix (e.g., `useDebounce`)
  - Utilities: camelCase (e.g., `debounce.ts`)
  - Types: PascalCase (e.g., `DebounceOptions`)

### Adding New Features

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Implement your feature with tests
3. Ensure all tests pass: `npm test && npm run test:e2e`
4. Check code coverage: `npm run test:coverage`
5. Lint your code: `npm run lint`
6. Commit with a descriptive message
7. Create a pull request

### Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Open Playwright UI |

## 🧪 Testing

### Unit Tests

Unit tests use Vitest and React Testing Library to test individual components and utilities.

**Run all unit tests:**

```bash
npm test
```

**Run tests in watch mode:**

```bash
npm test -- --watch
```

**Run specific test file:**

```bash
npm test -- useDebounce.test.ts
```

**Generate coverage report:**

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in your browser to view the detailed report.

### E2E Tests

End-to-end tests use Playwright to test the application in real browsers.

**Run all E2E tests:**

```bash
npm run test:e2e
```

**Run tests in headed mode:**

```bash
npm run test:e2e -- --headed
```

**Run specific test file:**

```bash
npm run test:e2e -- debounce.spec.ts
```

**Open Playwright UI:**

```bash
npm run test:e2e:ui
```

**Run tests in specific browser:**

```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

### Test Coverage Requirements

- **Minimum Overall Coverage**: 80%
- **Core Utilities**: 100% coverage required
- **Custom Hooks**: 95% coverage target
- **Components**: 80% coverage target

### Writing Tests

#### Unit Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    await waitFor(() => expect(result.current).toBe('updated'), {
      timeout: 600,
    });
  });
});
```

#### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('search demo should debounce input', async ({ page }) => {
  await page.goto('/');
  
  const searchInput = page.locator('[data-testid="search-input"]');
  const debouncedCounter = page.locator('[data-testid="debounced-counter"]');
  
  await searchInput.fill('test');
  await expect(debouncedCounter).toHaveText('0');
  
  await page.waitForTimeout(600);
  await expect(debouncedCounter).toHaveText('1');
});
```

## 🏗️ Architecture

### Component Hierarchy

```
App
├── Header
├── Navigation
├── TheorySection
│   ├── ComparisonTable
│   └── TimelineDiagram
├── ConfigPanel
├── SearchDemo
│   └── EventCounter
├── ResizeDemo
│   └── EventCounter
├── ScrollDemo
│   └── EventCounter
├── ButtonClickDemo
│   └── EventCounter
├── MetricsDashboard
└── Footer
```

### State Management

- **Local State**: Component-specific state using `useState`
- **Derived State**: Using custom hooks for debounced/throttled values
- **Props**: Parent-to-child communication for configuration
- **Events**: Child-to-parent communication for actions

### Custom Hooks Architecture

All custom hooks follow a consistent pattern:

1. Accept the value/callback and delay/interval
2. Use `useRef` to maintain mutable references
3. Use `useEffect` for setup and cleanup
4. Return the debounced/throttled value/callback

## 📚 API Documentation

### Utility Functions

#### `debounce(func, wait, options?)`

Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

**Parameters:**
- `func` (Function): The function to debounce
- `wait` (number): The delay in milliseconds
- `options` (object, optional):
  - `leading` (boolean): Execute on the leading edge
  - `trailing` (boolean): Execute on the trailing edge
  - `maxWait` (number): Maximum time to wait before execution

**Returns:** (Function) The debounced function

**Example:**
```typescript
const debouncedFn = debounce(() => console.log('Called'), 500);
```

#### `throttle(func, wait, options?)`

Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.

**Parameters:**
- `func` (Function): The function to throttle
- `wait` (number): The interval in milliseconds
- `options` (object, optional):
  - `leading` (boolean): Execute on the leading edge
  - `trailing` (boolean): Execute on the trailing edge

**Returns:** (Function) The throttled function

**Example:**
```typescript
const throttledFn = throttle(() => console.log('Called'), 1000);
```

### Custom Hooks

#### `useDebounce<T>(value: T, delay: number): T`

Returns a debounced version of the value that only updates after the specified delay.

**Parameters:**
- `value` (T): The value to debounce
- `delay` (number): The debounce delay in milliseconds

**Returns:** (T) The debounced value

#### `useDebouncedCallback<T>(callback: T, delay: number, deps: DependencyList)`

Returns a memoized debounced callback.

**Parameters:**
- `callback` (Function): The callback to debounce
- `delay` (number): The debounce delay in milliseconds
- `deps` (Array): Dependency array for the callback

**Returns:** (Function) The debounced callback

#### `useThrottle<T>(value: T, interval: number): T`

Returns a throttled version of the value that updates at most once per interval.

**Parameters:**
- `value` (T): The value to throttle
- `interval` (number): The throttle interval in milliseconds

**Returns:** (T) The throttled value

#### `useThrottledCallback<T>(callback: T, interval: number, deps: DependencyList)`

Returns a memoized throttled callback.

**Parameters:**
- `callback` (Function): The callback to throttle
- `interval` (number): The throttle interval in milliseconds
- `deps` (Array): Dependency array for the callback

**Returns:** (Function) The throttled callback

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Platforms

The application can be deployed to various platforms:

#### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

Or connect your GitHub repository to Vercel for automatic deployments.

#### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify
3. Or use Netlify CLI: `netlify deploy --prod`

#### GitHub Pages

1. Update `vite.config.ts` with base path
2. Build: `npm run build`
3. Deploy to `gh-pages` branch

#### Other Platforms

The built static files in `dist/` can be deployed to any static hosting service:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Cloudflare Pages
- Firebase Hosting

### Environment Variables

If needed, create a `.env` file:

```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Debounce & Throttle Tutorial
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/react_debounce_throttle.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Write or update tests
6. Ensure all tests pass
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to your fork: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Pull Request Guidelines

- Ensure all tests pass (`npm test && npm run test:e2e`)
- Maintain or improve code coverage
- Follow the existing code style
- Update documentation as needed
- Provide a clear description of changes

### Code Review Process

1. At least one maintainer must approve the PR
2. All CI checks must pass
3. Code coverage must meet minimum requirements
4. No merge conflicts with the main branch

### Reporting Issues

- Use the GitHub issue tracker
- Provide a clear description
- Include steps to reproduce
- Mention your environment (OS, Node version, browser)

## 📝 Development Phases

- [x] **Phase 1**: Setup & Infrastructure
- [x] **Phase 2**: Core Utilities (debounce/throttle functions and hooks)
- [x] **Phase 3**: UI Components
- [x] **Phase 4**: Interactive Demos
- [x] **Phase 5**: Educational Content
- [x] **Phase 6**: Testing
- [x] **Phase 7**: Polish & Documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License - Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

## 👥 Authors & Acknowledgments

**Created by:** Cloud-Native Team

**Special Thanks:**
- React team for the amazing framework
- Vite team for the blazing-fast build tool
- Testing Library maintainers
- Playwright team
- All contributors and learners

## 📞 Support

- **Documentation**: See [spec/spec.md](spec/spec.md) for detailed specifications
- **Issues**: [GitHub Issues](https://github.com/yourusername/react_debounce_throttle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/react_debounce_throttle/discussions)

## 🔗 Related Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Lodash Debounce/Throttle](https://lodash.com/docs/)
- [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)
- [Web Performance Optimization](https://web.dev/performance/)

---

**Project Status**: ✅ All phases complete - Production ready

**Version**: 1.0.0

Made with ❤️ for the developer community
