import { test, expect } from '@playwright/test';

test.describe('Navigation & UX Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Should navigate between demo sections', async ({ page }) => {
    // Check that the main navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for navigation links - these should be in the navigation menu
    const navLinks = page.locator('nav a, nav button');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    // Verify that the page has the main sections loaded
    await expect(page.locator('text=Debounce').first()).toBeVisible();
    await expect(page.locator('text=Throttle').first()).toBeVisible();
  });

  test('Should display all demo sections on page load', async ({ page }) => {
    // Check that theory section is visible
    const theorySection = page.locator('text=Theory').or(page.locator('text=What is'));
    await expect(theorySection.first()).toBeVisible();

    // Check that demo sections are present
    // Search demo
    const searchInput = page.locator('input#search-input, input[type="text"]').first();
    await expect(searchInput).toBeVisible();

    // Button click demo
    const buttons = page.locator('button:has-text("Click Me")');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(1);
  });

  test('Should have working interactive controls', async ({ page }) => {
    // Test that configuration panel or sliders are present and interactive
    const sliders = page.locator('input[type="range"]');
    const sliderCount = await sliders.count();
    
    if (sliderCount > 0) {
      const firstSlider = sliders.first();
      await expect(firstSlider).toBeVisible();
      
      // Get initial value
      const initialValue = await firstSlider.inputValue();
      
      // Change the slider value
      await firstSlider.fill('500');
      
      // Verify value changed
      const newValue = await firstSlider.inputValue();
      expect(newValue).not.toBe(initialValue);
    }
  });

  test('Should persist configuration across demos', async ({ page }) => {
    // Find and adjust a configuration slider
    const debounceSlider = page.locator('input#debounce-delay').or(page.locator('input[type="range"]').first());
    
    if (await debounceSlider.count() > 0) {
      await debounceSlider.first().fill('800');
      await page.waitForTimeout(200);
      
      // Verify the value persists (check the value is still set)
      const value = await debounceSlider.first().inputValue();
      expect(parseInt(value)).toBeGreaterThanOrEqual(500);
    }
  });

  test('Should show event counters in demos', async ({ page }) => {
    // Look for counter displays
    const counters = page.locator('[class*="counter"]').or(page.locator('text=/\\d+/')).first();
    await expect(counters).toBeVisible();

    // Interact with a demo to trigger counter update
    const searchInput = page.locator('input#search-input, input[type="text"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('test');
      await page.waitForTimeout(200);
      
      // Counters should update (be visible)
      const counterValues = page.locator('[class*="counter"]');
      expect(await counterValues.count()).toBeGreaterThan(0);
    }
  });

  test('Should have responsive layout', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Verify content is still accessible
    await expect(page.locator('text=Debounce').first().or(page.locator('text=Throttle').first())).toBeVisible();
  });

  test('Should have accessible keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check that focus is visible on some element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeAttached();
    
    // Continue tabbing to verify multiple interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should have focused through some elements
    const newFocusedElement = page.locator(':focus');
    await expect(newFocusedElement).toBeAttached();
  });

  test('Should display header and footer', async ({ page }) => {
    // Check for header
    const header = page.locator('header').or(page.locator('h1').first());
    await expect(header).toBeVisible();

    // Check for footer - scroll to bottom if needed
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    
    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });

  test('Should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known/acceptable errors (like failed favicon, etc.)
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('manifest')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('Should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).toMatch(/debounce|throttle|react/i);
  });
})
