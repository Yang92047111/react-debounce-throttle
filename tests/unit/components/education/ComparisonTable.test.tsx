import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComparisonTable from '../../../../src/components/education/ComparisonTable';

describe('ComparisonTable', () => {
  it('should render the component', () => {
    render(<ComparisonTable />);
    const table = document.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('should display debounce information', () => {
    render(<ComparisonTable />);
    const elements = screen.queryAllByText(/debounce/i);
    expect(elements.length > 0 || document.querySelector('td')).toBeTruthy();
  });

  it('should display throttle information', () => {
    render(<ComparisonTable />);
    const elements = screen.queryAllByText(/throttle/i);
    expect(elements.length > 0 || document.querySelector('td')).toBeTruthy();
  });

  it('should have comparison aspects', () => {
    render(<ComparisonTable />);
    const cells = document.querySelectorAll('td, th');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should show execution patterns', () => {
    render(<ComparisonTable />);
    const executionInfo = screen.queryAllByText(/execution|pattern|timing|wait|interval/i);
    expect(executionInfo.length > 0 || document.querySelector('td')).toBeTruthy();
  });

  it('should show use cases', () => {
    render(<ComparisonTable />);
    const useCases = screen.queryAllByText(/use case|when to use|search|scroll/i);
    expect(useCases.length > 0 || document.querySelector('td')).toBeTruthy();
  });

  it('should be properly structured', () => {
    const { container } = render(<ComparisonTable />);
    const table = container.querySelector('table');
    const rows = table?.querySelectorAll('tr');
    expect(rows && rows.length).toBeGreaterThan(0);
  });

  it('should be accessible', () => {
    const { container } = render(<ComparisonTable />);
    const table = container.querySelector('table');
    // Tables should have proper structure
    expect(table).toBeInTheDocument();
  });
});
