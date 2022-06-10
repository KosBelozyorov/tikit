const { test } = require('../framework/fixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test.describe.parallel('Tests by STAFF', () => {
  test.use({ storageState: 'staffStorageState.json' });
  test('Case #01 Add new ticket as STAFF', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    // test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.fillNewTicketFormAsStaff();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkCreatedTicketInfo(await createdTicket);
    await ticketPage.checkEmailForCreatedTicket(await createdTicket);
  });

  test('Case #02 Add new ticket behalf CONSUMER', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    // test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.fillNewTicketFormAsStaffBehalfConsumer();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkCreatedTicketInfo(await createdTicket);
    await ticketPage.checkEmailForCreatedTicket(await createdTicket);
  });
});
