const { test } = require('../framework/fixtures');
const { OWNER, STAFF, CONSUMER } = require('../framework/constants');

const roles = [OWNER, STAFF, CONSUMER];

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test.describe.parallel('Tests by owner, staff, consumer', () => {
  for (const role of roles) {
    test(`Case #01 Login as ${role.name} and logout`, async ({ loginPage }) => {
      await loginPage.loginAs(role);
      await loginPage.logout();
    });

    test(`Case #02 Add new ticket as ${role.name}`, async ({
      loginPage,
      ticketsPage,
      ticketPage,
      newTicketPage,
    }) => {
      test.slow(); // for slow test uncomment this line
      await loginPage.loginAs(role);
      await ticketsPage.openFormAddNewTicket();
      await newTicketPage.fillNewTicketForm(role);

      const createdTicket = await newTicketPage.SaveNewTicket();

      await ticketPage.checkCreatedTicketInfoByRole(await createdTicket, role);
    });
  }
});
