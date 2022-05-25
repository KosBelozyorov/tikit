const { test } = require('../framework/fixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test.describe.parallel('Owner tests', () => {
  test('Case #01 Login as owner', async ({ loginPage }) => {
    await loginPage.loginAsOwner();
  });
  test('Case #02 Add new ticket as owner', async ({
    loginPage,
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    // test.slow(); // for slow test uncomment this line
    await loginPage.loginAsOwner();
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.fillNewTicketForm();

    const myObject = await newTicketPage.SaveNewTicket();

    await ticketPage.checkCreatedTicketInfo(await myObject);
  });
});
