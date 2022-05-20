const { test, expect } = require('../framework/fixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test.describe('Staff tests', () => {
  test('Case #01 Login as staff', async ({ loginPage }) => {
    await loginPage.login();
  });
  test('Case #02 Add new ticket as staff', async ({
    loginPage,
    ticketsPage,
  }) => {
    test.slow();
    await loginPage.login();
    await ticketsPage.openFormAddNewTicket();
    await ticketsPage.fillNewTicketForm();
  });
});
