const { InbucketAPIClient } = require('inbucket-js-client');
const { test } = require('../framework/fixtures');
const {
  OWNER,
  STAFF,
  STAFF1,
  CONSUMER,
  PRODUCT1,
  PRODUCT2,
  PRODUCT3,
} = require('../framework/constants');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test.afterAll(() => {
  const emailsBoxes = [OWNER.email, STAFF.email, STAFF1.email, CONSUMER.email];
  const client = new InbucketAPIClient('http://ran.sysonline.com:9000');
  for (const box of emailsBoxes) {
    client.prugeMailbox(box);
  }
});

test.describe.parallel('Tests by OWNER', () => {
  test.use({ storageState: './testCredentials/ownerStorageState.json' });
  test('Case #01 Add new ticket', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.fillNewTicketFormAsOwner();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkCreatedTicketInfo(await createdTicket);
  });

  test('Case #02 Add new ticket, no product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('--');
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email];

    await ticketPage.checkNoEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
  });

  test('Case #03 Add new ticket, no product with assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('--');
    await newTicketPage.SelectCustomUser(STAFF1.user);
    await newTicketPage.setContactEmail(STAFF1.email);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    // eslint-disable-next-line no-console
    console.log('createdTicket: ', createdTicket);
    const emailsTo = [STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
  });

  test('Case #04 Add new ticket, with product and no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.setStaffName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
  });

  test('Case #05 Add new ticket with attachments, email checking', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(OWNER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setContactEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();
    await newTicketPage.UploadFiles(1);

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER_WITH_ATTACH',
      emailsTo,
    );
  });

  test('Case #06 Add new ticket, with product and assignee to OWNER', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT3);
    await newTicketPage.SelectCustomUser(OWNER.user);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email];

    await ticketPage.checkNoEmailForCreatedTicket(createdTicket, emailsTo);
  });

  test('Case #07 Add new ticket, with product and assignee to STAFF', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.SelectCustomUser(STAFF1.user);
    await newTicketPage.setContactEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
  });

  test('Case #08 Add new ticket behalf staff no product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(STAFF1.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
  });

  test('Case #09 Add new ticket behalf staff no product, with assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(STAFF1.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomUser(STAFF.user);
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [STAFF1.email, STAFF.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'AS_STAFF',
      emailsTo,
    );
  });

  test('Case #10 Add new ticket behalf staff with product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(STAFF1.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT2);
    await newTicketPage.setContactName(STAFF.user);
    await newTicketPage.setStaffEmail(STAFF.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [STAFF1.email, STAFF.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'AS_STAFF',
      emailsTo,
    );
  });

  test('Case #11 Add new ticket behalf consumer no product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(CONSUMER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.setContactName(CONSUMER.user);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [CONSUMER.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'CONSUMER',
      emailsTo,
    );
  });

  test('Case #12 Add new ticket behalf consumer no product, with assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(CONSUMER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomUser(STAFF1.user);
    await newTicketPage.setContactName(CONSUMER.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [CONSUMER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER_AS_CONSUMER',
      emailsTo,
    );
  });

  test('Case #13 Add new ticket behalf consumer with product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(CONSUMER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [CONSUMER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'AS_CONSUMER',
      emailsTo,
    );
  });
});
