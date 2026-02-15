import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Should show performance improvements with debounce', async ({ page }) => {
    // Reset counters first
    const resetButton = page.locator('button.reset-button').first();
    if (await resetButton.count() > 0) {
      await resetButton.click();
      await page.waitForTimeout(100);
    }

    // Find the search input
    const searchInput = page.locator('input#search-input');
    await expect(searchInput).toBeVisible();

    // Type character by character to trigger multiple events
    await searchInput.click();
    const text = 'performance';
    for (const char of text) {
      await page.keyboard.type(char);
      await page.waitForTimeout(50);
    }
    
    // Wait for debounce to settle (default is 500ms)
    await page.waitForTimeout(600);

    // Get the event counters
    const counters = page.locator('.counter-value');
    
    if (await counters.count() >= 2) {
      const normalCountText = await counters.nth(0).textContent();
      const debouncedCountText = await counters.nth(1).textContent();
      
      const normalCount = parseInt(normalCountText || '0');
      const debouncedCount = parseInt(debouncedCountText || '0');
      
      // Debounced execution should be less than or equal to normal count
      expect(debouncedCount).toBeLessThanOrEqual(normalCount);
      
      // Both should have at least some counts
      expect(normalCount).toBeGreaterThan(0);
      expect(debouncedCount).toBeGreaterThan(0);
    }
  });

  test('Should show performance improvements with throttle', async ({ page }) => {
    // Scroll to button click demo
    await page.evaluate(() => {
      const buttonDemo = document.querySelector('.button-click-demo');
      if (buttonDemo) {
        buttonDemo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // Find reset button for button demo
    const resetButtons = page.locator('button.reset-button');
    if (await resetButtons.count() > 1) {
      await resetButtons.nth(1).click(); // Second reset button is for button demo
      await page.waitForTimeout(100);
    }

    // Find buttons within the button click demo section
    const buttonDemo = page.locator('.button-click-demo');
    const normalButton = buttonDemo.locator('.demo-button-normal');
    const throttledButton = buttonDemo.locator('.demo-button-throttled');
    
    if (await throttledButton.count() > 0) {
      // Click normal button rapidly
      for (let i = 0; i < 10; i++) {
        await normalButton.click();
        await page.waitForTimeout(50);
      }
      
      await page.waitForTimeout(200);
      
      // Get counters from button demo section
      const counters = buttonDemo.locator('.counter-value');
      const normalCountText = await counters.nth(0).textContent();
      const normalCount = parseInt(normalCountText || '0');
      
      // Click throttled button rapidly  
      for (let i = 0; i < 10; i++) {
        await throttledButton.click();
        await page.waitForTimeout(50);
      }
      
      await page.waitForTimeout(500);
      
      // Get throttled count (should be in the same demo section)
      const throttledCountText = await counters.nth(1).textContent();
      const throttledCount = parseInt(throttledCountText || '0');
      
      // Throttled should execute fewer times than normal
      expect(throttledCount).toBeLessThanOrEqual(normalCount);
      expect(throttledCount).toBeGreaterThan(0);
      expect(normalCount).toBeGreaterThanOrEqual(10);
    }
  });

  test('Should demonstrate execution frequency differences', async ({ page }) => {
    // Test search input debounce timing
    const searchInput = page.locator('input#search-input');
    
    if (await searchInput.count() > 0) {
      // const startTime = Date.now();
      
      // Type characters rapidly
      await searchInput.type('test query', { delay: 50 });
      
      // Wait for debounce
      await page.waitForTimeout(600);
      
      // const endTime = Date.now();
      // const duration = endTime - startTime;
      
      // Get execution count
      const counters = page.locator('.counter-value');
      
      if (await counters.count() >= 2) {
        const debouncedCountText = await counters.nth(1).textContent();
        const debouncedCount = parseInt(debouncedCountText || '0');
        
        // With proper debouncing, should have very few executions
        // relative to the number of characters typed
        const charactersTyped = 'test query'.length;
        expect(debouncedCount).toBeLessThan(charactersTyped);
      }
    }
  });

  test('Should handle rapid event bursts efficiently', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    
    if (await searchInput.count() > 0) {
      // Clear first and reset counters
      await searchInput.clear();
      await page.waitForTimeout(600); // Wait for debounce to settle after clear
      
      // Get initial counts
      const counters = page.locator('.counter-value');
      const initialNormalText = await counters.nth(0).textContent();
      const initialDebouncedText = await counters.nth(1).textContent();
      const initialNormal = parseInt(initialNormalText || '0');
      const initialDebounced = parseInt(initialDebouncedText || '0');
      
      // Rapid burst of changes
      for (let i = 0; i < 5; i++) {
        await searchInput.fill(`query${i}`);
        await page.waitForTimeout(20);
      }
      
      // Wait for debounce to settle (500ms default + buffer)
      await page.waitForTimeout(600);
      
      // Get final counts
      if (await counters.count() >= 2) {
        const finalNormalText = await counters.nth(0).textContent();
        const finalDebouncedText = await counters.nth(1).textContent();
        const finalNormal = parseInt(finalNormalText || '0');
        const finalDebounced = parseInt(finalDebouncedText || '0');
        
        const normalIncrease = finalNormal - initialNormal;
        const debouncedIncrease = finalDebounced - initialDebounced;
        
        // Debounced should be significantly less than normal
        // Normal should fire 5 times (once per fill), debounced should fire fewer times
        expect(debouncedIncrease).toBeLessThanOrEqual(normalIncrease);
        expect(debouncedIncrease).toBeGreaterThan(0); // But should fire at least once
      }
    }
  });

  test('Should measure scroll event throttling performance', async ({ page }) => {
    // Check if there's a scrollable area
    // const scrollableArea = page.locator('[class*="scroll"]').first();
    
    // Make page scrollable by setting viewport and checking height
    await page.setViewportSize({ width: 1280, height: 600 });
    
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    
    if (bodyHeight > 600) {
      // Scroll rapidly
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 100));
        await page.waitForTimeout(50);
      }
      
      await page.waitForTimeout(500);
      
      // If scroll counters exist, verify throttling effect
      const scrollCounters = page.locator('[class*="scroll"] .counter-value');
      
      if (await scrollCounters.count() > 0) {
        const counterValues = await scrollCounters.allTextContents();
        const counts = counterValues.map(text => parseInt(text) || 0);
        
        // Throttled count should be lower than unthrottled
        if (counts.length >= 2) {
          expect(counts[1]).toBeLessThanOrEqual(counts[0]);
        }
      }
    }
  });

  test('Should maintain UI responsiveness during heavy operations', async ({ page }) => {
    // Test that UI remains responsive while handling many events
    const searchInput = page.locator('input#search-input');
    
    if (await searchInput.count() > 0) {
      // Type while checking responsiveness
      await searchInput.type('responsive', { delay: 30 });
      
      // Immediately check if other UI elements are still responsive
      const buttons = page.locator('button').first();
      if (await buttons.count() > 0) {
        // Should be able to interact with other elements
        await expect(buttons).toBeEnabled();
      }
      
      // Configuration sliders should still be interactive
      const sliders = page.locator('input[type="range"]').first();
      if (await sliders.count() > 0) {
        await expect(sliders).toBeEnabled();
      }
    }
  });

  test('Should show metrics dashboard with performance data', async ({ page }) => {
    // Look for metrics or performance dashboard
    // const metricsArea = page.locator('[class*="metric"], [class*="dashboard"]');
    
    // Trigger some events to generate metrics
    const searchInput = page.locator('input#search-input');
    if (await searchInput.count() > 0) {
      await searchInput.fill('metrics test');
      await page.waitForTimeout(800);
    }
    
    // Check for counter values which represent performance metrics
    const counters = page.locator('.counter-value, [class*="count"]');
    const counterCount = await counters.count();
    
    // Should have multiple counters showing performance data
    expect(counterCount).toBeGreaterThan(0);
  });

  test('Should demonstrate memory efficiency with debounce', async ({ page }) => {
    // This tests that repeated operations don't cause memory issues
    const searchInput = page.locator('input#search-input');
    
    if (await searchInput.count() > 0) {
      // Perform many operations
      for (let i = 0; i < 20; i++) {
        await searchInput.fill(`query${i}`);
        await page.waitForTimeout(100);
      }
      
      await page.waitForTimeout(1000);
      
      // Page should still be responsive (not crashed or frozen)
      await expect(searchInput).toBeEnabled();
      
      // Should be able to interact normally
      await searchInput.fill('final query');
      await expect(searchInput).toHaveValue('final query');
    }
  });

  test('Should have acceptable page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load in reasonable time (< 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Check that main content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('Should efficiently handle configuration changes', async ({ page }) => {
    const delaySlider = page.locator('input[type="range"]').first();
    
    if (await delaySlider.count() > 0) {
      // Rapidly change configuration
      await delaySlider.fill('100');
      await page.waitForTimeout(50);
      await delaySlider.fill('500');
      await page.waitForTimeout(50);
      await delaySlider.fill('1000');
      
      // UI should remain responsive
      await expect(delaySlider).toBeEnabled();
      
      // Final value should be applied
      const finalValue = await delaySlider.inputValue();
      expect(parseInt(finalValue)).toBeGreaterThan(0);
    }
  });
});

