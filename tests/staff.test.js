const { InbucketAPIClient } = require('inbucket-js-client');
const {
  OWNER,
  STAFF,
  STAFF1,
  CONSUMER,
  PRODUCT1,
  PRODUCT3,
} = require('../framework/constants');
const { test } = require('../framework/fixtures');

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

test.describe.parallel('Tests by STAFF', () => {
  test.use({ storageState: './testCredentials/staffStorageState.json' });
  test('Case #01 Add new ticket', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.fillNewTicketFormAsStaff();

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
    await newTicketPage.FillCustomContactField(STAFF.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('--');
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.setContactName(OWNER.user);
    await newTicketPage.setStaffEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email];

    await ticketPage.checkEmailForCreatedTicket(
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
    await newTicketPage.FillCustomContactField(STAFF.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('--');
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

  test('Case #04 Add new ticket, with product and no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(STAFF.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.setOwnerName(OWNER.user);
    await newTicketPage.setOwnerEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'STAFF_TO_STAFF',
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
    await newTicketPage.FillCustomContactField(STAFF.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.SelectCustomUser('None');
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
      'STAFF_TO_STAFF_WITH_ATTACH',
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
    await newTicketPage.setOwnerEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
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

  test('Case #08 Add new ticket behalf OWNER no product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(OWNER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER',
      emailsTo,
    );
  });

  test('Case #09 Add new ticket behalf OWNER no product, with assignee to STAFF', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(OWNER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomUser(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    // eslint-disable-next-line no-console
    console.log('createdTicket: ', createdTicket);
    const emailsTo = [OWNER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'AS_OWNER',
      emailsTo,
    );
  });

  test('Case #10 Add new ticket behalf OWNER with product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField(OWNER.user);
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct(PRODUCT1);
    await newTicketPage.setContactName(STAFF1.user);
    await newTicketPage.setStaffEmail(STAFF1.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email, STAFF1.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'AS_OWNER',
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
    await newTicketPage.setOwnerName(OWNER.user);
    await newTicketPage.setOwnerEmail(OWNER.email);
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();
    const emailsTo = [OWNER.email, CONSUMER.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'STAFF_AS_CONSUMER',
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
      'AS_CONSUMER',
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
    const emailsTo = [CONSUMER.email, STAFF1.email, OWNER.email];

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'AS_CONSUMER',
      emailsTo,
    );
  });
});
