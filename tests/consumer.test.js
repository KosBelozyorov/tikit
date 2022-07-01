const { InbucketAPIClient } = require('inbucket-js-client');
const { test } = require('../framework/fixtures');

const {
  CONSUMER,
  OWNER,
  STAFF,
  STAFF1,
  PRODUCT1,
} = require('../framework/constants');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test.describe.parallel('Tests by CONSUMER', () => {
  test.use({ storageState: './testCredentials/consumerStorageState.json' });

  test('Case #01 Add new ticket', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.fillNewTicketFormAsConsumer();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkCreatedTicketInfoByRole(createdTicket, CONSUMER);
  });

  test('Case #02 Add new ticket, no product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('--');
    await newTicketPage.setAuthor(CONSUMER);
    await newTicketPage.setOwnerName(OWNER.user);
    await newTicketPage.setOwnerEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'CONSUMER',
      emailsTo,
    );
  });

  test('Case #03 Add new ticket, with product and no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.setAuthor(CONSUMER);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.setOwnerName(OWNER.user);
    await newTicketPage.setOwnerEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'CONSUMER',
      emailsTo,
    );
  });

  test('Case #04 Add new ticket with attachments, email checking', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.setAuthor(CONSUMER);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.setOwnerName(OWNER.user);
    await newTicketPage.setOwnerEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();
    await newTicketPage.UploadFiles(1);

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'CONSUMER_WITH_ATTACH',
      emailsTo,
    );
  });
});
