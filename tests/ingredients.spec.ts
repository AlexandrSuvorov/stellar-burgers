import { test, expect } from '@playwright/test';

test('Записываем HAR файл ингредиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/ingredients',
    update: false
  });

  await page.goto('/');
  await expect(page.getByTestId('burger-ingredients-list')).toBeVisible();
});
