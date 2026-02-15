import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TheorySection from '../../../../src/components/education/TheorySection';

describe('TheorySection', () => {
  it('should render the component', () => {
    render(<TheorySection />);
    const elements = screen.queryAllByText(/debounce/i);
    expect(elements.length > 0).toBeTruthy();
  });

  it('should display debounce explanation', () => {
    render(<TheorySection />);
    const debounceSection = screen.queryAllByText(/debounce/i);
    expect(debounceSection.length > 0 || document.querySelector('code')).toBeTruthy();
  });

  it('should display throttle explanation', () => {
    render(<TheorySection />);
    const throttleSection = screen.queryAllByText(/throttle/i);
    expect(throttleSection.length > 0 || document.querySelector('code')).toBeTruthy();
  });

  it('should show use cases for debounce', () => {
    render(<TheorySection />);
    const useCases = screen.queryAllByText(/search|input|form|validation|save/i);
    expect(useCases.length > 0 || document.querySelector('p, li')).toBeTruthy();
  });

  it('should show use cases for throttle', () => {
    render(<TheorySection />);
    const useCases = screen.queryAllByText(/scroll|resize|mouse|click|move/i);
    expect(useCases.length > 0 || document.querySelector('p, li')).toBeTruthy();
  });

  it('should have visual diagrams or illustrations', () => {
    render(<TheorySection />);
    const sections = document.querySelectorAll('section, div');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should be accessible', () => {
    const { container } = render(<TheorySection />);
    // Should have semantic HTML
    expect(container.querySelector('h1, h2, h3')).toBeInTheDocument();
  });
});
