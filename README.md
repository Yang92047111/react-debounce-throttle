# Debounce and Throttle Tutorial - React Application

An interactive educational web application that demonstrates the concepts and practical applications of debounce and throttle techniques in React.

## 🎯 Purpose

This application provides visual feedback, real-time comparisons, and hands-on examples to help developers understand when and how to use debounce and throttle optimization techniques.

## 🚀 Target Audience

- Frontend developers learning React
- Developers interested in performance optimization
- Students studying event handling patterns

## 📚 Key Learning Objectives

- Understand the difference between debounce and throttle
- Learn when to use each technique
- See real-time visual demonstrations
- Practice implementation in React applications

## 🛠️ Technical Stack

- **Framework**: React 18+
- **Build Tool**: Vite 5+
- **Language**: TypeScript
- **Testing**: Vitest + React Testing Library + Playwright
- **Utilities**: lodash

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🔧 Installation

```bash
# Clone the repository
git clone <repository-url>
cd react_debounce_throttle

# Install dependencies
npm install

# Install Playwright browsers (for E2E testing)
npx playwright install
```

## 💻 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## 📁 Project Structure

```
react_debounce_throttle/
├── src/
│   ├── components/
│   │   ├── demos/          # Interactive demo components
│   │   ├── ui/             # UI components (counters, panels, etc.)
│   │   ├── education/      # Educational content components
│   │   └── layout/         # Layout components (header, footer, nav)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions (debounce, throttle)
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global and component styles
├── tests/
│   ├── unit/               # Unit tests
│   └── e2e/                # End-to-end tests
└── spec/                   # Project specification
```

## 🎓 Features

### Interactive Demos

1. **Search Input Demo** - Demonstrates API call optimization with debounce
2. **Window Resize Demo** - Shows throttle for window event optimization
3. **Scroll Event Demo** - Compares debounce vs throttle for scroll events
4. **Button Click Demo** - Demonstrates throttle for form submission protection

### Educational Content

- Theory sections explaining debounce and throttle
- Visual timeline diagrams
- Code examples with syntax highlighting
- Comparison tables and best practices

### Performance Metrics

- Real-time execution count comparisons
- Visual feedback and indicators
- Configurable timing parameters

## 📝 Development Phases

- [x] **Phase 1**: Setup & Infrastructure (Current)
- [ ] **Phase 2**: Core Utilities (debounce/throttle functions and hooks)
- [ ] **Phase 3**: UI Components
- [ ] **Phase 4**: Interactive Demos
- [ ] **Phase 5**: Educational Content
- [ ] **Phase 6**: Testing
- [ ] **Phase 7**: Polish & Documentation

## 🔄 Git Workflow

This project follows Git Flow:

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- Pull requests require tests passing and code review

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request to `develop`

## 📄 License

MIT

## 👥 Authors

Created as part of a React learning project.

---

**Project Status**: Phase 1 - Infrastructure Setup Complete ✅
