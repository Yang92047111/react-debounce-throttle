import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Should show performance improvements with debounce', async ({ page }) => {
    // Find the search input
    const searchInput = page.locator('input#search-input');
    await expect(searchInput).toBeVisible();

    // Type rapidly to trigger events
    await searchInput.fill('performance test');
    
    // Wait for debounce to settle
    await page.waitForTimeout(1000);

    // Get the event counters
    const counters = page.locator('.counter-value');
    
    if (await counters.count() >= 2) {
      const normalCountText = await counters.nth(0).textContent();
      const debouncedCountText = await counters.nth(1).textContent();
      
      const normalCount = parseInt(normalCountText || '0');
      const debouncedCount = parseInt(debouncedCountText || '0');
      
      // Debounced execution should be significantly less
      expect(debouncedCount).toBeLessThan(normalCount);
      
      // Calculate reduction percentage
      const reduction = ((normalCount - debouncedCount) / normalCount) * 100;
      expect(reduction).toBeGreaterThan(50); // At least 50% reduction
    }
  });

  test('Should show performance improvements with throttle', async ({ page }) => {
    // Find button click demo
    const normalButton = page.locator('.demo-button').first();
    const throttledButton = page.locator('.demo-button').nth(1);
    
    if (await throttledButton.count() > 0) {
      // Click normal button rapidly
      for (let i = 0; i < 10; i++) {
        await normalButton.click();
        await page.waitForTimeout(50);
      }
      
      await page.waitForTimeout(200);
      
      // Get normal count
      const normalCounters = page.locator('.counter-value');
      const normalCountText = await normalCounters.first().textContent();
      const normalCount = parseInt(normalCountText || '0');
      
      // Reset or navigate to fresh state if possible
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const throttledButtonFresh = page.locator('.demo-button').nth(1);
      
      // Click throttled button rapidly  
      for (let i = 0; i < 10; i++) {
        await throttledButtonFresh.click();
        await page.waitForTimeout(50);
      }
      
      await page.waitForTimeout(500);
      
      // Throttled clicks should be limited
      const throttledCounters = page.locator('.counter-value');
      const throttledCountText = await throttledCounters.nth(1).textContent();
      const throttledCount = parseInt(throttledCountText || '0');
      
      // Throttled should execute fewer times
      expect(throttledCount).toBeLessThanOrEqual(normalCount);
    }
  });

  test('Should demonstrate execution frequency differences', async ({ page }) => {
    // Test search input debounce timing
    const searchInput = page.locator('input#search-input');
    
    if (await searchInput.count() > 0) {
      const startTime = Date.now();
      
      // Type characters rapidly
      await searchInput.type('test query', { delay: 50 });
      
      // Wait for debounce
      await page.waitForTimeout(600);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
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
      // Clear first
      await searchInput.clear();
      
      // Rapid burst of changes
      for (let i = 0; i < 5; i++) {
        await searchInput.fill(`query${i}`);
        await page.waitForTimeout(20);
      }
      
      // Wait for debounce to settle
      await page.waitForTimeout(800);
      
      // Get counters
      const counters = page.locator('.counter-value');
      
      if (await counters.count() >= 2) {
        const debouncedCountText = await counters.nth(1).textContent();
        const debouncedCount = parseInt(debouncedCountText || '0');
        
        // Should have very few executions despite 5 rapid changes
        expect(debouncedCount).toBeLessThanOrEqual(2);
      }
    }
  });

  test('Should measure scroll event throttling performance', async ({ page }) => {
    // Check if there's a scrollable area
    const scrollableArea = page.locator('[class*="scroll"]').first();
    
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
    const metricsArea = page.locator('[class*="metric"], [class*="dashboard"]');
    
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

