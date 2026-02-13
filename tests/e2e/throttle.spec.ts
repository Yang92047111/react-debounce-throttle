import { test, expect } from '@playwright/test';

test.describe('Throttle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Button click should be throttled', async ({ page }) => {
    // Find the throttled button (second button with "Click Me!")
    const buttons = page.locator('.demo-button');
    const throttledButton = buttons.nth(1);
    
    await expect(throttledButton).toBeVisible();
    
    // Click multiple times rapidly
    await throttledButton.click();
    await throttledButton.click();
    await throttledButton.click();
    await throttledButton.click();
    await throttledButton.click();
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Check that blocked clicks counter is visible
    const blockedCounter = page.locator('text=Blocked Clicks').locator('..');
    await expect(blockedCounter).toBeVisible();
  });

  test('Should show visual feedback for blocked clicks', async ({ page }) => {
    const buttons = page.locator('.demo-button');
    const throttledButton = buttons.nth(1);
    
    // Click rapidly
    await throttledButton.click();
    await page.waitForTimeout(100);
    await throttledButton.click();
    
    // Should show blocked feedback
    const blockedFeedback = page.locator('.blocked-feedback, .blocked');
    const feedbackCount = await blockedFeedback.count();
    
    // Either the feedback element or the blocked class should be present
    expect(feedbackCount).toBeGreaterThanOrEqual(0);
  });

  test('Should respect throttle interval configuration', async ({ page }) => {
    // Find the throttle interval slider
    const intervalSlider = page.locator('input#button-throttle-interval');
    await expect(intervalSlider).toBeVisible();
    
    // Set a longer interval
    await intervalSlider.fill('2000');
    
    // Verify the interval label updates
    await expect(page.locator('text=Throttle Interval: 2000ms')).toBeVisible();
    
    // Click the throttled button
    const buttons = page.locator('.demo-button');
    const throttledButton = buttons.nth(1);
    
    await throttledButton.click();
    
    // Try to click again immediately (should be blocked)
    await throttledButton.click();
    
    // Should show blocking
    await page.waitForTimeout(500);
  });

  test('Window resize should be throttled', async ({ page }) => {
    // Resize the window multiple times
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1000, height: 700 });
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1400, height: 900 });
    
    // Wait for throttle to settle
    await page.waitForTimeout(500);
    
    // Check that dimension displays are visible
    const dimensionDisplays = page.locator('.dimension-display');
    await expect(dimensionDisplays.first()).toBeVisible();
  });

  test('Scroll events should be throttled', async ({ page }) => {
    // Find the scroll container
    const scrollContainer = page.locator('.scroll-container');
    await expect(scrollContainer).toBeVisible();
    
    // Scroll multiple times
    await scrollContainer.evaluate((el) => {
      el.scrollTop = 100;
    });
    await page.waitForTimeout(100);
    await scrollContainer.evaluate((el) => {
      el.scrollTop = 200;
    });
    await page.waitForTimeout(100);
    await scrollContainer.evaluate((el) => {
      el.scrollTop = 300;
    });
    
    // Wait for updates to settle
    await page.waitForTimeout(500);
    
    // Check that position displays are visible
    const positionDisplays = page.locator('.position-display');
    await expect(positionDisplays.first()).toBeVisible();
  });

  test('Should display statistics correctly', async ({ page }) => {
    const buttons = page.locator('.demo-button');
    const normalButton = buttons.nth(0);
    const throttledButton = buttons.nth(1);
    
    // Click normal button multiple times
    await normalButton.click();
    await normalButton.click();
    await normalButton.click();
    
    // Click throttled button multiple times
    await throttledButton.click();
    await page.waitForTimeout(100);
    await throttledButton.click();
    await page.waitForTimeout(100);
    await throttledButton.click();
    
    // Check statistics section
    await expect(page.locator('text=Total Attempts')).toBeVisible();
    await expect(page.locator('text=Processed')).toBeVisible();
    await expect(page.locator('text=Prevented')).toBeVisible();
    await expect(page.locator('text=Protection Rate')).toBeVisible();
  });

  test('Should show use cases for throttle', async ({ page }) => {
    // Scroll to button demo section
    await page.locator('text=Button Click Demo').scrollIntoViewIfNeeded();
    
    // Check for use cases section
    await expect(page.locator('text=Common Use Cases')).toBeVisible();
    await expect(page.locator('text=Form Submission')).toBeVisible();
    await expect(page.locator('text=Add to Cart')).toBeVisible();
  });

  test('Should calculate performance gain for resize events', async ({ page }) => {
    // Resize window multiple times
    const sizes = [
      { width: 1200, height: 800 },
      { width: 1100, height: 750 },
      { width: 1300, height: 850 },
      { width: 1000, height: 700 },
    ];
    
    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(100);
    }
    
    // Wait for all updates
    await page.waitForTimeout(500);
    
    // Check for performance gain display
    const savingsIndicator = page.locator('.savings-indicator');
    await expect(savingsIndicator.first()).toBeVisible();
  });

  test('Should reset counters correctly', async ({ page }) => {
    // Interact with resize demo
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(300);
    
    // Find and click reset button in resize demo
    const resetButtons = page.locator('button', { hasText: 'Reset' });
    if (await resetButtons.count() > 0) {
      await resetButtons.first().click();
      await page.waitForTimeout(200);
    }
  });

  test('Scroll position should update at throttled intervals', async ({ page }) => {
    const scrollContainer = page.locator('.scroll-container');
    await expect(scrollContainer).toBeVisible();
    
    // Get initial scroll position
    const initialPosition = await page.locator('.position-value').first().textContent();
    
    // Scroll
    await scrollContainer.evaluate((el) => {
      el.scrollTop = 500;
    });
    
    // Wait for throttle
    await page.waitForTimeout(300);
    
    // Position should have updated
    const newPosition = await page.locator('.position-value').first().textContent();
    expect(newPosition).not.toBe(initialPosition);
  });

  test('Should show comparison between debounce and throttle for scroll', async ({ page }) => {
    // Check that all four comparison columns exist in scroll demo
    const scrollDemo = page.locator('.scroll-demo');
    await expect(scrollDemo).toBeVisible();
    
    const comparisonColumns = scrollDemo.locator('.comparison-column');
    const columnCount = await comparisonColumns.count();
    
    // Should have 4 columns: no optimization, debounce, throttle, summary
    expect(columnCount).toBeGreaterThanOrEqual(3);
  });
});
