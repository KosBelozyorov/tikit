const { test } = require('../framework/fixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
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
    // test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('--');
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'OWNER');
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
    await newTicketPage.SelectCustomUser('test staff');
    await newTicketPage.setContactEmail('belozerov_kos@ukr.net');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'OWNER');
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
    await newTicketPage.SelectCustomProduct('test product');
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.setContactName('test staff');
    await newTicketPage.setContactEmail('belozerov_kos@ukr.net');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'OWNER');
  });

  test('Case #05 Add new ticket with attachments, email checking', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('test product');
    await newTicketPage.SelectCustomUser('None');
    await newTicketPage.setContactName('test staff');
    await newTicketPage.setContactEmail('belozerov_kos@ukr.net');
    await newTicketPage.FillDescriptionField();
    await newTicketPage.UploadFiles(2);

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(
      createdTicket,
      'OWNER_WITH_ATTACH',
    );
  });

  test('Case #06 Add new ticket, with product and assignee to OWNER', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    // test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.ReadContactField();
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('test product');
    await newTicketPage.SelectCustomUser('Kostya Belozyorov');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'OWNER');
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
    await newTicketPage.SelectCustomProduct('test product');
    await newTicketPage.SelectCustomUser('test staff');
    await newTicketPage.setContactEmail('belozerov_kos@ukr.net');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'OWNER');
  });

  test('Case #08 Add new ticket behalf staff', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField('test staff');
    await newTicketPage.FillSubjectField();
    await newTicketPage.SelectCustomProduct('test product');
    await newTicketPage.SelectCustomTopic('Test topic');
    await newTicketPage.SelectCustomUser('test staff');
    await newTicketPage.setContactEmail('belozerov_kos@ukr.net');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'OWNER');
  });

  test('Case #09 Add new ticket behalf consumer no product, no assignee', async ({
    ticketsPage,
    ticketPage,
    newTicketPage,
  }) => {
    test.slow(); // for slow test uncomment this line
    await ticketsPage.openFormAddNewTicket();
    await newTicketPage.FillCustomContactField('User Consumer');
    await newTicketPage.FillSubjectField();
    await newTicketPage.setContactName('User Consumer');
    await newTicketPage.FillDescriptionField();

    const createdTicket = await newTicketPage.SaveNewTicket();

    await ticketPage.checkEmailForCreatedTicket(createdTicket, 'CONSUMER');
  });

  // test('Case #10 Add new ticket behalf consumer no product, with assignee', async ({
  //   ticketsPage,
  //   ticketPage,
  //   newTicketPage,
  // }) => {
  //   test.slow(); // for slow test uncomment this line
  //   await ticketsPage.openFormAddNewTicket();
  //   await newTicketPage.FillCustomContactField('User Consumer');
  //   await newTicketPage.FillSubjectField();
  //   await newTicketPage.SelectCustomUser('test staff');
  //   await newTicketPage.setContactName('User Consumer');
  //   await newTicketPage.setStaffEmail('belozerov_kos@ukr.net');
  //   await newTicketPage.FillDescriptionField();
  //   await newTicketPage.UploadFiles(1);

  //   const createdTicket = await newTicketPage.SaveNewTicket();

  //   await ticketPage.checkEmailForCreatedTicket(createdTicket, 'AS_CONSUMER');
  // });

  // test('Case #11 Add new ticket behalf consumer with product, no assignee', async ({
  //   ticketsPage,
  //   ticketPage,
  //   newTicketPage,
  // }) => {
  //   test.slow(); // for slow test uncomment this line
  //   await ticketsPage.openFormAddNewTicket();
  //   await newTicketPage.FillCustomContactField('User Consumer');
  //   await newTicketPage.FillSubjectField();
  //   await newTicketPage.SelectCustomProduct('test product');
  //   // await newTicketPage.SelectCustomTopic('Test topic');
  //   // await newTicketPage.SelectCustomUser('test staff');
  //   await newTicketPage.setContactName('User Consumer');
  //   await newTicketPage.FillDescriptionField();
  //   await newTicketPage.UploadFiles(2);

  //   const createdTicket = await newTicketPage.SaveNewTicket();

  //   await ticketPage.checkEmailForCreatedTicket(createdTicket, 'consumer');
  // });
});
