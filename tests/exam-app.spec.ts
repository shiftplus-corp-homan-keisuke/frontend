import { test, expect } from '@playwright/test';

test('Exam App Basic Verification', async ({ page }) => {
  // 1. Navigate to the app (assuming dev server is running on 5173)
  await page.goto('http://localhost:5173');

  // 2. Check Header
  await expect(page.getByRole('link', { name: 'DBスペシャリスト図鑑' })).toBeVisible();

  // 3. Click on the exam card '令和6年 春期'
  await page.getByRole('link', { name: '令和6年 春期' }).click();

  // 4. Verify URL and Question Page
  await expect(page).toHaveURL(/.*\/exam\/2024r06a_db_pm2/);
  await expect(page.getByText('問1 概念データモデルの設計と関係スキーマの設計')).toBeVisible();

  // 5. Expand '設問1'
  // Use a more specific locator if needed, but text should work for this app
  await page.getByRole('button', { name: '設問1' }).click();

  // 6. Verify Answer section is visible after expansion
  const answerToggle = page.getByText('解答と解説を表示');
  await expect(answerToggle).toBeVisible();

  // 7. Toggle Answer
  await answerToggle.click();

  // 8. Verify Answer text
  // Since we have placeholder text in the JSON, we check for that or the "正解:" label
  await expect(page.getByText('正解:')).toBeVisible();
});
