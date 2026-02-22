# Playwright Tutorial

## Table of Contents
- [What is Playwright?](#what-is-playwright)
- [Playwright Run Flow](#playwright-run-flow)
- [Configuration](#configuration)
- [Essential Functions & APIs](#essential-functions--apis)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)

---

## What is Playwright?

Playwright is a modern end-to-end testing framework developed by Microsoft that enables reliable testing of web applications across all major browsers (Chromium, Firefox, and WebKit). It provides a powerful API for automating browser interactions and validating application behavior.

### Key Features
- **Cross-browser testing**: Run tests on Chromium, Firefox, and WebKit
- **Auto-waiting**: Automatically waits for elements to be ready before interacting
- **Network interception**: Control and mock network requests
- **Mobile emulation**: Test responsive designs and mobile-specific behavior
- **Parallel execution**: Run tests concurrently for faster results

---

## Playwright Run Flow

### 1. Configuration Loading
Playwright reads `playwright.config.ts` to determine:
- Test directory location
- Browser projects to run
- Base URL and other settings
- Web server configuration

### 2. Web Server Startup
```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
}
```
- Starts the development server before running tests
- Waits for the server to be ready
- Reuses existing server in development, starts fresh in CI

### 3. Test Discovery
- Scans the `testDir` (default: `./tests/e2e`) for test files
- Files matching `*.spec.ts` or `*.test.ts` patterns
- Organizes tests by `test.describe()` blocks

### 4. Test Execution
For each test:
1. **Setup**: Runs `test.beforeEach()` hooks
2. **Execution**: Runs the test function
3. **Teardown**: Runs `test.afterEach()` hooks (if defined)
4. **Retry**: On failure, retries based on config (2 times in CI)

### 5. Reporting
- Generates HTML report by default
- Captures traces on first retry for debugging
- Outputs test results to console

---

## Configuration

### Project Configuration
Located in [playwright.config.ts](../playwright.config.ts):

```typescript
export default defineConfig({
  testDir: './tests/e2e',              // Test directory
  fullyParallel: true,                 // Run tests in parallel
  forbidOnly: !!process.env.CI,        // Fail CI if test.only() exists
  retries: process.env.CI ? 2 : 0,     // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Parallel workers
  reporter: 'html',                    // HTML test report
  use: {
    baseURL: 'http://localhost:5173',  // Base URL for navigation
    trace: 'on-first-retry',           // Capture trace for debugging
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Key Configuration Options
- **testDir**: Directory containing test files
- **fullyParallel**: Enable parallel test execution
- **retries**: Number of retry attempts for failed tests
- **workers**: Number of concurrent workers
- **baseURL**: Default base URL for `page.goto()`
- **trace**: When to capture execution traces for debugging

---

## Essential Functions & APIs

### Page Navigation

#### `page.goto(url)`
Navigate to a URL. Relative URLs use `baseURL` from config.
```typescript
await page.goto('/');  // Goes to http://localhost:5173/
```

#### `page.waitForLoadState(state)`
Wait for a specific load state.
```typescript
await page.waitForLoadState('networkidle');  // Wait for network to be idle
// Other states: 'load', 'domcontentloaded'
```

---

### Locators

Locators are the core of Playwright's auto-waiting mechanism. They represent a way to find elements on the page.

#### `page.locator(selector)`
Create a locator for an element.
```typescript
const searchInput = page.locator('input#search-input');
const buttons = page.locator('.demo-button');
```

#### Locator Methods

**`.first()` / `.last()` / `.nth(index)`**
Select specific elements from multiple matches.
```typescript
const firstButton = page.locator('button').first();
const secondButton = page.locator('button').nth(1);
```

**`.count()`**
Get the number of matching elements.
```typescript
const buttonCount = await page.locator('button').count();
```

**`.textContent()`**
Get the text content of an element.
```typescript
const text = await page.locator('.counter-value').textContent();
const count = parseInt(text || '0');
```

**`.inputValue()`**
Get the value of an input element.
```typescript
const value = await page.locator('input').inputValue();
```

**`.fill(value)`**
Fill an input field.
```typescript
await page.locator('input#search-input').fill('test query');
```

**`.click()`**
Click an element.
```typescript
await page.locator('button.reset-button').click();
```

---

### Keyboard & Mouse

#### `page.keyboard.type(text)`
Type text character by character (simulates human typing).
```typescript
await searchInput.click();
for (const char of 'test') {
  await page.keyboard.type(char);
  await page.waitForTimeout(50);
}
```

#### `page.setViewportSize(size)`
Change the viewport size (useful for responsive testing).
```typescript
await page.setViewportSize({ width: 1200, height: 800 });
```

---

### Waiting & Timing

#### `page.waitForTimeout(ms)`
Wait for a specific duration.
```typescript
await page.waitForTimeout(600);  // Wait 600ms for debounce to settle
```

**⚠️ Warning**: Avoid overusing timeouts. Prefer auto-waiting and explicit conditions.

#### `expect(locator).toBeVisible()`
Wait for an element to be visible.
```typescript
await expect(searchInput).toBeVisible();
```

---

### Assertions

Playwright uses the `expect` API from `@playwright/test`.

#### Common Assertions

**Visibility**
```typescript
await expect(element).toBeVisible();
await expect(element).toBeHidden();
```

**Value Comparisons**
```typescript
expect(count).toBe(5);
expect(count).toBeGreaterThan(0);
expect(count).toBeLessThanOrEqual(10);
expect(text).toContain('success');
```

**Locator State**
```typescript
await expect(locator).toHaveText('Expected text');
await expect(locator).toHaveValue('input value');
await expect(locator).toHaveCount(3);
```

---

### Advanced Selectors

#### CSS Selectors
```typescript
page.locator('input#search-input')        // ID
page.locator('.demo-button')              // Class
page.locator('button.reset-button')       // Element + class
page.locator('[type="range"]')            // Attribute
```

#### Text Selectors
```typescript
page.locator('text=Debounce')             // Exact text
page.locator('text=/\\d+/')               // Regex pattern
page.locator('button:has-text("Click")') // Partial text
```

#### Chaining Locators
```typescript
const buttonDemo = page.locator('.button-click-demo');
const button = buttonDemo.locator('.demo-button-normal');
```

#### `.or()` for Multiple Selectors
```typescript
const element = page.locator('input#search-input').or(page.locator('input[type="text"]'));
```

---

### Page Evaluation

#### `page.evaluate(fn)`
Execute JavaScript in the browser context.
```typescript
await page.evaluate(() => {
  window.scrollTo(0, 100);
});
```

#### `locator.evaluate(fn)`
Execute JavaScript on a specific element.
```typescript
await scrollContainer.evaluate((el) => {
  el.scrollTop = 200;
});
```

---

## Common Patterns

### Pattern 1: Reset State Before Testing
```typescript
test('Should test feature', async ({ page }) => {
  // Reset counters or state
  const resetButton = page.locator('button.reset-button').first();
  if (await resetButton.count() > 0) {
    await resetButton.click();
    await page.waitForTimeout(100);
  }
  
  // Continue with test...
});
```

### Pattern 2: Type Character by Character
Useful for testing debounce/throttle behavior.
```typescript
const searchInput = page.locator('input#search-input');
await searchInput.click();
for (const char of 'test') {
  await page.keyboard.type(char);
  await page.waitForTimeout(50);   // Simulate human typing speed
}
```

### Pattern 3: Wait for Async Operations
```typescript
// Type and wait for debounce to settle
await searchInput.fill('query');
await page.waitForTimeout(600);  // Wait for 500ms debounce + buffer

// Then verify results
const resultsBox = page.locator('.results-box');
await expect(resultsBox).toBeVisible();
```

### Pattern 4: Test Configuration Changes
```typescript
// Change a slider value
const delaySlider = page.locator('input#debounce-delay');
await delaySlider.fill('1000');

// Verify the UI updates
await expect(page.locator('text=Debounce Delay: 1000ms').first()).toBeVisible();
```

### Pattern 5: Select from Multiple Elements
```typescript
const buttons = page.locator('.demo-button');
const normalButton = buttons.nth(0);      // First button
const throttledButton = buttons.nth(1);   // Second button
```

### Pattern 6: Check Element Existence
```typescript
if (await resetButton.count() > 0) {
  // Element exists, interact with it
  await resetButton.click();
}
```

### Pattern 7: Scroll to Element
```typescript
await page.evaluate(() => {
  const element = document.querySelector('.section');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
await page.waitForTimeout(500);  // Wait for scroll to complete
```

---

## Best Practices

### 1. Use Auto-Waiting
Playwright automatically waits for elements to be actionable. Avoid manual waits when possible.

**Good:**
```typescript
await page.locator('button').click();
await expect(page.locator('.result')).toBeVisible();
```

**Avoid:**
```typescript
await page.waitForTimeout(1000);
await page.locator('button').click();
```

### 2. Use Specific Selectors
Prefer specific, semantic selectors over generic ones.

**Good:**
```typescript
page.locator('input#search-input')
page.locator('button.reset-button')
```

**Avoid:**
```typescript
page.locator('input').nth(3)  // Fragile
page.locator('div > div > button')  // Too dependent on structure
```

### 3. Test User Behavior, Not Implementation
Focus on what users see and do, not internal implementation.

**Good:**
```typescript
test('Should filter results when typing', async ({ page }) => {
  await searchInput.fill('query');
  await expect(results).toBeVisible();
});
```

**Avoid:**
```typescript
test('Should call debounce function', async ({ page }) => {
  // Testing implementation details
});
```

### 4. Organize Tests with `test.describe()`
Group related tests together.

```typescript
test.describe('Debounce Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Should debounce search', async ({ page }) => {
    // Test implementation
  });

  test('Should respect delay configuration', async ({ page }) => {
    // Test implementation
  });
});
```

### 5. Use `beforeEach` for Common Setup
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});
```

### 6. Test Multiple Browsers
Use the configured browser projects to ensure cross-browser compatibility.

```typescript
// Tests automatically run on chromium, firefox, and webkit
```

### 7. Handle Dynamic Content
For content that loads asynchronously, use explicit waits.

```typescript
await expect(page.locator('.api-results')).toBeVisible();
```

### 8. Use Meaningful Test Names
```typescript
test('Should show performance improvements with debounce', async ({ page }) => {
  // Clear test intention
});
```

### 9. Clean Up Between Tests
Reset state to ensure test isolation.

```typescript
const resetButton = page.locator('button.reset-button');
if (await resetButton.count() > 0) {
  await resetButton.click();
}
```

### 10. Verify Both Positive and Negative Cases
```typescript
// Positive: Check that debounced count is recorded
expect(debouncedCount).toBeGreaterThanOrEqual(1);

// Negative: Check that debounced count is less than normal
expect(debouncedCount).toBeLessThanOrEqual(normalCount);
```

---

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/debounce.spec.ts
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### View Test Report
```bash
npx playwright show-report
```

### Trace Viewer (After Test Failure)
```bash
npx playwright show-trace trace.zip
```

---

## Debugging Tips

### 1. Use `--headed` to See Browser
```bash
npx playwright test --headed
```

### 2. Use `--debug` for Step-by-Step Debugging
```bash
npx playwright test --debug
```

### 3. Add `page.pause()` to Stop Execution
```typescript
await page.goto('/');
await page.pause();  // Pauses execution, opens inspector
```

### 4. Use `console.log()` for Values
```typescript
const text = await element.textContent();
console.log('Element text:', text);
```

### 5. Check Screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### 6. Use Trace Viewer
Traces are automatically captured on first retry. View them with:
```bash
npx playwright show-report
```

---

## Test File Structure

Based on the project's test organization:

```
tests/
├── e2e/
│   ├── debounce.spec.ts      # Tests for debounce functionality
│   ├── throttle.spec.ts       # Tests for throttle functionality
│   ├── navigation.spec.ts     # UI navigation and UX tests
│   └── performance.spec.ts    # Performance comparison tests
└── setup.ts                   # Test setup configuration
```

### Example Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Should do something specific', async ({ page }) => {
    // Arrange: Set up test conditions
    const element = page.locator('.selector');
    
    // Act: Perform actions
    await element.click();
    
    // Assert: Verify results
    await expect(element).toBeVisible();
  });
});
```

---

## Summary

Playwright provides a powerful, reliable framework for end-to-end testing. Key takeaways:

1. **Auto-waiting**: Playwright automatically waits for elements to be ready
2. **Locators**: Use specific, meaningful selectors
3. **Configuration**: Centralize test settings in `playwright.config.ts`
4. **Cross-browser**: Test on multiple browsers with minimal effort
5. **Best Practices**: Focus on user behavior, not implementation details

For more information, visit the [official Playwright documentation](https://playwright.dev/).
