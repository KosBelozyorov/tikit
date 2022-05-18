const { test, expect } = require('../framework/fixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test('Case #01 Login as user', async ({ loginPage }) => {
  await loginPage.login();
});
