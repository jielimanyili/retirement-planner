import { test, expect } from '@playwright/test';

test('calculates a retirement projection end-to-end', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Retirement Planner' }),
  ).toBeVisible();

  await page.getByLabel('Current age').fill('30');
  await page.getByLabel('Retirement age').fill('65');
  await page.getByLabel('Current savings ($)').fill('50000');
  await page.getByLabel('Monthly contribution ($)').fill('500');
  await page.getByLabel('Expected annual return (%)').fill('7');

  await page.getByRole('button', { name: 'Calculate projection' }).click();

  await expect(
    page.getByRole('heading', { name: 'Your projection' }),
  ).toBeVisible();
  await expect(page.getByText('Total growth')).toBeVisible();
});
