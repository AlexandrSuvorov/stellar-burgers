import { test, expect } from '@playwright/test';

test.describe('Список ингредиентов с HAR', () => {
  test('Записывает HAR ingredients', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '/api/ingredients',
      update: false
    });

    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients-list')).toBeVisible();
  });

  test('Данный автотест загружает ингредиенты из HAR-файла', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '/api/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('loading-ingredients')).not.toBeVisible();

    const list = page.getByTestId('burger-ingredients-list');
    await expect(list).toBeVisible();

    await expect(page.getByTestId('643d69a5c3f7b9001cfa093c')).toBeVisible();
    await expect(page.getByTestId('643d69a5c3f7b9001cfa0941')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('Данный автотест отрабатывает без реального сервера', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '/ingredients'
    });

    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients-list')).toBeVisible();
  });

  test('Данный автотест добавляет булку и проверяет, что она выбралась', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '/api/ingredients',
      update: false
    });
    await page.goto('/');

    await expect(page.getByTestId('burger-ingredients-list')).toBeVisible();

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
  });
});
