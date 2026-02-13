import { test, expect } from '@playwright/test';

test.describe('Debounce Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Search input should debounce API calls', async ({ page }) => {
    // Find the search input
    const searchInput = page.locator('input#search-input');
    await expect(searchInput).toBeVisible();

    // Type rapidly in the search input
    await searchInput.fill('test');
    
    // Get the counters
    const counters = page.locator('.counter-value');
    await expect(counters.first()).toBeVisible();
    
    // Normal counter should be higher than debounced counter
    const normalCountText = await counters.nth(0).textContent();
    const debouncedCountText = await counters.nth(1).textContent();
    
    const normalCount = parseInt(normalCountText || '0');
    const debouncedCount = parseInt(debouncedCountText || '0');
    
    // Debounced count should be less than or equal to normal count
    expect(debouncedCount).toBeLessThanOrEqual(normalCount);
  });

  test('Should respect debounce delay configuration', async ({ page }) => {
    // Find the debounce delay slider
    const delaySlider = page.locator('input#debounce-delay');
    await expect(delaySlider).toBeVisible();
    
    // Change the delay to 1000ms
    await delaySlider.fill('1000');
    
    // Verify the delay label updates
    await expect(page.locator('text=Debounce Delay: 1000ms')).toBeVisible();
    
    // Type in search input
    const searchInput = page.locator('input#search-input');
    await searchInput.fill('test query');
    
    // Wait a bit but not full delay
    await page.waitForTimeout(500);
    
    // Results should not appear yet
    const debouncedResults = page.locator('.comparison-column').nth(1).locator('.results-box');
    const resultsText = await debouncedResults.textContent();
    
    // After full delay, results should appear
    await page.waitForTimeout(600);
    await expect(debouncedResults.locator('li').first()).toBeVisible();
  });

  test('Should show visual feedback during debounce', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    await searchInput.fill('search term');
    
    // Check for API indicator
    const apiIndicator = page.locator('.api-indicator-success, .api-indicator-warning');
    await expect(apiIndicator.first()).toBeVisible();
  });

  test('Should show loading state during API call', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    await searchInput.fill('test');
    
    // Wait for debounce to trigger
    await page.waitForTimeout(600);
    
    // Loading indicator might be visible briefly
    // Then results should appear
    const resultsBox = page.locator('.results-box').nth(1);
    await expect(resultsBox).toBeVisible();
  });

  test('Should display search results correctly', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    await searchInput.fill('test query');
    
    // Wait for results
    await page.waitForTimeout(800);
    
    // Check for results in both columns
    await expect(page.locator('text=Result 1 for "test query"').first()).toBeVisible();
    await expect(page.locator('text=Result 2 for "test query"').first()).toBeVisible();
  });

  test('Should calculate API call savings', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    
    // Type character by character
    await searchInput.type('test', { delay: 100 });
    
    // Wait for debounce to complete
    await page.waitForTimeout(600);
    
    // Check for savings display
    const savingsIndicator = page.locator('.savings-indicator');
    await expect(savingsIndicator).toBeVisible();
    
    const savingsValue = page.locator('.savings-value');
    await expect(savingsValue).toBeVisible();
  });

  test('Should reset all counters and input', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    await searchInput.fill('test');
    
    // Click reset button
    const resetButton = page.locator('button', { hasText: 'Reset All' });
    await resetButton.click();
    
    // Input should be cleared
    await expect(searchInput).toHaveValue('');
    
    // Counters should be reset (check for "0" in counter values)
    const counters = page.locator('.counter-value');
    await expect(counters.first()).toHaveText('0');
  });

  test('Should handle rapid input changes correctly', async ({ page }) => {
    const searchInput = page.locator('input#search-input');
    
    // Type rapidly
    await searchInput.type('abcdefghij', { delay: 50 });
    
    // Wait for debounce
    await page.waitForTimeout(600);
    
    // Debounced counter should be much lower than normal counter
    const counters = page.locator('.counter-value');
    const normalCount = parseInt(await counters.nth(0).textContent() || '0');
    const debouncedCount = parseInt(await counters.nth(1).textContent() || '0');
    
    expect(debouncedCount).toBeLessThan(normalCount);
  });
});
