import { test, expect } from '@playwright/test';

test.describe('Данный автотест создает заказ', () => {
  test.beforeEach(async ({ context, page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await context.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await context.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    await expect(page.getByTestId('burger-ingredients-list')).toBeVisible();
  });

  test('Данный автотест создает заказ с авторизованным пользователем', async ({
    page
  }) => {
    await page
      .getByTestId('643d69a5c3f7b9001cfa093c')
      .getByRole('button', { name: /Добавить/i })
      .click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i (верх)'
    );

    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Краторная булка N-200i (низ)'
    );

    await page.getByTestId('create-order').click();

    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('order-number')).toContainText('12345');

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();

    await page.getByTestId('close-modal').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
