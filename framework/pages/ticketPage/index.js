const { expect } = require('@playwright/test');
const axios = require('axios');
// const mailhog = require('mailhog')({
//   host: 'rig.sysonline.com',
//   port: 8025,
// });
// const utf8 = require('utf8');
// const quotedPrintable = require('quoted-printable');
// const { simpleParser } = require('mailparser');
const { InbucketAPIClient } = require('inbucket-js-client');
const { waits } = require('../../../lib');

const {
  TICKET_SUBJECT,
  TICKET_CREATED_BY,
  TICKET_CREATED_WITH_PRODUCT,
  TICKET_CREATED_WITH_PRIORITY,
  TICKET_CREATED_WITH_TITLE,
  TICKET_CREATED_WITH_DESCRIPTION,
  TICKET_CREATED_WITH_TYPE,
  TICKET_CREATED_WITH_ASSIGNED_TO,
  TICKET_CREATED_SHOW_ATTACH_BUTTON,
  TICKET_CREATED_WITH_ATTACH,
  TICKET_CREATED_WITH_ID,
  EMAIL_FROM,
  BASE_SYSTEM_URL,
  PRODUCT1,
  PRODUCT2,
  STAFF1,
  OWNER,
  CONSUMER,
} = require('../../constants');

class TicketPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.ticketSubject = this.page.locator(TICKET_SUBJECT);
    this.ticketCreatedBy = this.page.locator(TICKET_CREATED_BY);
    this.ticketCreatedWithProduct = this.page.locator(
      TICKET_CREATED_WITH_PRODUCT,
    );
    this.ticketCreatedWithPriority = this.page.locator(
      TICKET_CREATED_WITH_PRIORITY,
    );
    this.ticketCreatedWithTitle = this.page.locator(TICKET_CREATED_WITH_TITLE);
    this.ticketCreatedWithDescription = this.page.locator(
      TICKET_CREATED_WITH_DESCRIPTION,
    );
    this.ticketCreatedWithType = this.page.locator(TICKET_CREATED_WITH_TYPE);
    this.ticketCreatedWithAssignedTo = this.page.locator(
      TICKET_CREATED_WITH_ASSIGNED_TO,
    );
    this.ticketCreatedShowAttach = this.page
      .locator(TICKET_CREATED_SHOW_ATTACH_BUTTON)
      .first();
    this.ticketCreatedWithAttach = this.page.locator(
      TICKET_CREATED_WITH_ATTACH,
    );

    this.ticketCreatedWithId = this.page.locator(TICKET_CREATED_WITH_ID);
    this.ticket = { ...this.createdTicket };
  }

  async getContactName() {
    const fullContactNameField =
      await this.newTicketFormContactField.textContent();
    const contactName = fullContactNameField.split(' - ')[0];
    this.ticket.name = contactName;

    return contactName;
  }

  async getTicketId(ticket) {
    const ticketSelector = `.card-wrap.select-all__box label:has-text("${await ticket.uid}")`;
    await Promise.all([
      await waits(this.page).waitVisibility(ticketSelector),

      await this.page.locator(ticketSelector).click(),
    ]);

    await expect.soft(this.ticketCreatedWithId).toHaveText(/\d/g);

    const createdTicketId = await this.ticketCreatedWithId.textContent();

    const ticketId = createdTicketId.replace(/[^\d;]/g, '');

    await ticket;
    // eslint-disable-next-line no-prototype-builtins
    if (!ticket.hasOwnProperty('id')) {
      // eslint-disable-next-line no-param-reassign
      ticket.id = ticketId;
    }

    return ticketId;
  }

  // eslint-disable-next-line class-methods-use-this
  async getTicketIdFromDB(ticket) {
    const systemTicketId = await ticket.id;

    const data = {
      action: 'get-ticket-info',
      ticket_number: `${await systemTicketId}`,
      site_id: `${process.env.SYSTEM_ID}`,
    };

    const ticketIdFromDB = await axios
      .post(process.env.API_BASE_URL, JSON.stringify(data))
      .then(res => {
        // eslint-disable-next-line no-console
        // console.log(`Status: ${res.status}`);
        // eslint-disable-next-line no-console
        // console.log('Body: ', res.data.ticket.id);

        return res.data.ticket.id;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    // eslint-disable-next-line no-param-reassign
    ticket.dbId = await ticketIdFromDB;

    return ticketIdFromDB;
  }

  async checkTicketUrl(ticket) {
    const ticketId = await this.getTicketId(ticket);

    const baseUrl = 'https://test-kb.coworkplace.us/tickets/';
    const expectedUrl = `${baseUrl}${ticketId}`;

    await expect.soft(this.page).toHaveURL(expectedUrl);
    // eslint-disable-next-line no-param-reassign
    ticket.url = expectedUrl;
  }

  async checkTicketCreator(ticket) {
    await expect.soft(this.ticketCreatedBy).toHaveText(await ticket.author);
  }

  async checkTicketProduct(ticket) {
    await expect
      .soft(this.ticketCreatedWithProduct)
      .toHaveAttribute('data-original-title', await ticket.product);
  }

  async checkTicketPriority(ticket) {
    await expect
      .soft(this.ticketCreatedWithPriority)
      .toHaveAttribute('data-original-title', await ticket.priority);
  }

  async checkTicketAssignedTo(ticket) {
    await expect
      .soft(this.ticketCreatedWithAssignedTo)
      .toHaveText(await ticket.name);
  }

  async checkTicketSubject(ticket) {
    await expect
      .soft(this.ticketCreatedWithTitle)
      .toHaveText(await ticket.subject);
  }

  async checkTicketType(ticket) {
    await expect
      .soft(this.ticketCreatedWithType)
      .toHaveAttribute('data-original-title', await ticket.type);
  }

  async checkTicketAttachments(ticket) {
    await Promise.all([
      await ticket,
      await this.ticketCreatedShowAttach.click(),
      // await this.ticketCreatedWithAttach.allTextContents(),
    ]);
    const actualAttachments =
      await this.ticketCreatedWithAttach.allTextContents();

    const attach = this.page.locator('.ticket-file__name > a');
    const attachmentsList2 = await attach.evaluateAll(list =>
      list.map(element => element.textContent),
    );
    // eslint-disable-next-line no-console
    console.log('attachmentsList2: ', attachmentsList2);
    // eslint-disable-next-line no-console
    console.log('actualAttachments: ', actualAttachments);

    const expectedAttachments = await ticket.attachments;
    // eslint-disable-next-line no-console
    console.log('expectedAttachments: ', expectedAttachments);

    expect
      .soft(
        await this.equalArrays(expectedAttachments, actualAttachments),
        'The actual amount of attachments should be equal to the expected amount of attachments.',
      )
      .toBeTruthy();
  }

  // ===== Email Checking =====

  // eslint-disable-next-line class-methods-use-this
  async getEmailsFromInbucket(ticket, emailToList) {
    const client = new InbucketAPIClient('http://ran.sysonline.com:9000');
    const ticketSubject = await ticket.uid;
    const emailsList = [];

    for await (const emailTo of emailToList) {
      const inbox = await client.mailbox(emailTo);

      for await (const item of inbox) {
        const message = await client.message(emailTo, item.id);

        if (message.body.text.includes(ticketSubject)) {
          emailsList.push(message);
          // eslint-disable-next-line no-console
          // console.log('message in array: ', emailsList);
          // return emailsList;
        }
      }
    }

    // eslint-disable-next-line no-console
    // console.log('message in array: ', emailsList);

    return emailsList;
  }

  // eslint-disable-next-line class-methods-use-this
  async getEmailFromSearch(ticket, role, emailsTo) {
    const ticketSubject = await ticket.uid;
    // const ticketSubject = '5RRt0_j8wc';
    // eslint-disable-next-line no-console
    console.log('subject: ', ticketSubject);

    const client = new InbucketAPIClient('http://ran.sysonline.com:9000');
    const inbox = await client.mailbox(emailsTo);
    // eslint-disable-next-line no-console
    // console.log('inbox: ', inbox);
    // let email;
    const emailsList = [];
    // eslint-disable-next-line no-console
    // console.log('attach amount: ', ticket.attachments.length);
    // if (ticket.attachments && ticket.attachments.length > 0) {
    // eslint-disable-next-line no-console
    // console.log('Attach is');
    // await this.page.waitForTimeout(4000);
    // eslint-disable-next-line no-console
    // console.log('After wait');
    // email = await mailhog.search(subject, 'containing');
    // }
    // email = await mailhog.search(subject, 'containing');

    for await (const item of inbox) {
      const message = await client.message(emailsTo, item.id);

      if (message.body.text.includes(ticketSubject)) {
        emailsList.push(message);
        // eslint-disable-next-line no-console
        // console.log('message in array: ', emailsList);
        // return emailsList;
      }
    }

    // eslint-disable-next-line no-console
    console.log('email list:', emailsList);

    return emailsList;
  }

  // eslint-disable-next-line class-methods-use-this
  async getEmailAddressFrom(email) {
    // eslint-disable-next-line no-useless-escape
    const regex = /(?<=\<)[^>]+(?=\>)/g;
    const emailFrom = await email.from.match(regex)[0];

    return emailFrom;
  }

  // eslint-disable-next-line class-methods-use-this
  async getEmailAddressTo(email) {
    // eslint-disable-next-line no-useless-escape
    const regex = /(?<=\<)[^>]+(?=\>)/g;
    const emailTo = await email.to[0].match(regex)[0];
    // eslint-disable-next-line no-console
    console.log('emailTo: ', emailTo);

    return emailTo;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAttachmentsFrom(email) {
    await email;
    const emailAttachments = await email.attachments;
    const attachmentsList = emailAttachments.map(item => item.filename);
    // const parsedEmail = await simpleParser(email.Raw.Data);
    // eslint-disable-next-line no-console
    // console.log('parsedEmail: ', parsedEmail);
    // const getAttachments = parsedEmail.attachments.filter(
    //   item => item.contentDisposition !== 'inline',
    // );
    // const attachmentsList = getAttachments.map(item => item.filename);
    // eslint-disable-next-line no-console
    console.log('attachmentsList: ', attachmentsList);

    return attachmentsList;
  }

  // TODO: Move this function to the Lib
  // eslint-disable-next-line class-methods-use-this
  async equalArrays(expected, actual) {
    if (expected.length !== actual.length) {
      // eslint-disable-next-line no-console
      console.log('expected length !== actual length');

      return false;
    }

    for (let i = 0; i < expected.length; i += 1)
      if (expected.indexOf(actual[i]) < 0) return false;

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkName(obj, role) {
    switch (role) {
      case 'OWNER_WITH_ATTACH':
        if (obj.name === 'None' && obj.user && obj.ownerName) {
          return obj.ownerName;
        }

        if (
          obj.author === CONSUMER.user &&
          obj.user === STAFF1.user &&
          obj.ownerName === OWNER.user
        ) {
          return obj.ownerName;
        }
        break;
      case 'OWNER':
        if (
          obj.author === CONSUMER.user &&
          obj.user === STAFF1.user &&
          obj.product === PRODUCT1 &&
          !obj.ownerName
        ) {
          return obj.user;
        }

        if (
          obj.author === OWNER.user &&
          obj.name === STAFF1.user &&
          !obj.staffEmail &&
          !obj.product &&
          !obj.ownerName
        ) {
          return obj.author;
        }

        if (
          obj.author === OWNER.user &&
          obj.name === STAFF1.user &&
          obj.email === STAFF1.email &&
          obj.staffEmail === STAFF1.email &&
          !obj.product &&
          !obj.ownerName
        ) {
          return obj.name;
        }

        if (
          obj.author === OWNER.user &&
          obj.name === STAFF1.user &&
          obj.email === OWNER.email &&
          obj.staffEmail === STAFF1.email &&
          !obj.product &&
          !obj.ownerName
        ) {
          return obj.author;
        }

        if (
          obj.author === OWNER.user &&
          obj.user === STAFF1.user &&
          obj.product === PRODUCT1 &&
          !obj.ownerName
        ) {
          return obj.author;
        }

        if (
          obj.author === STAFF1.user &&
          obj.user === STAFF1.user &&
          obj.product === PRODUCT2
        ) {
          return obj.user;
        }

        if (obj.author === OWNER.user && obj.user === STAFF1.user) {
          return obj.author;
        }

        if (
          obj.author === OWNER.user &&
          !obj.user &&
          obj.staffName === STAFF1.user
        ) {
          return obj.staffName;
        }

        if (
          obj.author === CONSUMER.user &&
          obj.user === STAFF1.user &&
          obj.ownerName === OWNER.user
        ) {
          return obj.ownerName;
        }

        if (obj.ownerName) {
          return obj.ownerName;
        }
        break;
      case 'CONSUMER':
        if (obj.user === OWNER.user) {
          return obj.user;
        }

        if (
          obj.author === CONSUMER.user &&
          obj.user === STAFF1.user &&
          obj.ownerName === OWNER.user
        ) {
          return obj.user;
        }

        if (
          obj.author === CONSUMER.user &&
          !obj.user &&
          obj.ownerName === OWNER.user
        ) {
          return obj.ownerEmail;
        }
        break;
      case 'CONSUMER_WITH_ATTACH':
        // eslint-disable-next-line no-console
        console.log('consumer with attach');
        if (obj.user === STAFF1.user) {
          // eslint-disable-next-line no-console
          console.log('into');
          return obj.user;
        }
        break;
      case 'AS_STAFF':
        if (
          obj.author === OWNER.user &&
          obj.user === STAFF1.user &&
          obj.product === PRODUCT1 &&
          !obj.ownerName
        ) {
          return obj.user;
        }
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('invalid role');
      // return obj.name;
    }

    if (obj.name === 'None' && obj.user && !obj.ownerName) {
      return obj.user;
    }

    // eslint-disable-next-line no-prototype-builtins
    if (!obj.hasOwnProperty('name') && !obj.hasOwnProperty('staffEmail')) {
      return obj.author;
    }

    // eslint-disable-next-line no-prototype-builtins
    // if (
    //   obj.user === STAFF1.user &&
    //   obj.product === PRODUCT1 &&
    //   role === 'OWNER' &&
    //   obj.author === CONSUMER.user
    // ) {
    //   return obj.user;
    // }

    // if (
    //   obj.user === STAFF1.user &&
    //   obj.product === 'PRODUCT2 &&
    //   role === 'OWNER' &&
    //   obj.author === 'STAFF1.user
    // ) {
    //   return obj.user;
    // }

    // if (role === 'OWNER' && obj.ownerName) {
    //   return obj.ownerName;
    // }

    return obj.name;
  }

  async getEmails(ticket, role, emailsTo) {
    await this.getTicketIdFromDB(ticket);

    const createdTicket = await ticket;
    // const searchEmail = await this.getEmailFromSearch(
    const searchEmail = await this.getEmailsFromInbucket(
      createdTicket,
      // role,
      emailsTo,
    );

    return searchEmail;
  }

  /*
   * Assertions
   */

  async checkEmailAttachments(ticket, email) {
    const receivedEmail = await email;
    const emailAttachments = await this.getAttachmentsFrom(receivedEmail);
    // eslint-disable-next-line no-console
    console.log('emailAttachments: ', emailAttachments);
    const expectedMailAttachments = ticket.attachments;
    // eslint-disable-next-line no-console
    console.log('expectedMailAttachments: ', expectedMailAttachments);

    expect
      .soft(
        await this.equalArrays(expectedMailAttachments, emailAttachments),
        'Actual attachments amount should be equal to expected attachments amount',
      )
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailFrom(email) {
    // const emailFrom = `${email.From.Mailbox}@${email.From.Domain}`;
    const emailFrom = await this.getEmailAddressFrom(email);
    // eslint-disable-next-line no-console
    console.log('emailFrom: ', emailFrom);
    const expectedEmailFrom = EMAIL_FROM;

    expect.soft(emailFrom).toEqual(expectedEmailFrom);
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailTo(ticket, email, role = '') {
    let expectedEmailTo;
    // eslint-disable-next-line no-console
    // console.log('ticket: ', ticket);

    switch (role) {
      case 'OWNER':
        if (
          ticket.author === OWNER.user &&
          ticket.name === STAFF1.user &&
          ticket.staffEmail === STAFF1.email
        ) {
          expectedEmailTo = ticket.email;
          // eslint-disable-next-line no-console
          console.log('expectedEmailTo in: ', expectedEmailTo);
        } else if (
          ticket.author === OWNER.user &&
          ticket.user === STAFF1.user &&
          ticket.staffEmail === STAFF1.email &&
          ticket.product === PRODUCT1
        ) {
          expectedEmailTo = ticket.email;
          // eslint-disable-next-line no-console
          console.log('expectedEmailTo in: ', expectedEmailTo);
        } else if (
          ticket.author === CONSUMER.user &&
          ticket.email === CONSUMER.email &&
          ticket.product === PRODUCT1 &&
          ticket.user === STAFF1.user &&
          ticket.staffEmail === STAFF1.email &&
          ticket.ownerName === OWNER.user &&
          ticket.ownerEmail === OWNER.ownerEmail
        ) {
          expectedEmailTo = ticket.ownerEmail;
          // eslint-disable-next-line no-console
          console.log('expectedEmailTo in: ', expectedEmailTo);
        } else if (
          // eslint-disable-next-line no-prototype-builtins
          ticket.hasOwnProperty('staffEmail') &&
          // eslint-disable-next-line no-prototype-builtins
          !ticket.hasOwnProperty('ownerEmail')
        ) {
          expectedEmailTo = ticket.staffEmail;
        } else if (
          // eslint-disable-next-line no-prototype-builtins
          ticket.hasOwnProperty('ownerEmail')
        ) {
          expectedEmailTo = ticket.ownerEmail;
        } else {
          expectedEmailTo = ticket.email;
        }

        // expectedEmailTo = ticket.email;
        // eslint-disable-next-line no-console
        console.log('expectedEmailTo in: ', expectedEmailTo);
        break;
      case 'OWNER_WITH_ATTACH':
        // eslint-disable-next-line no-console
        console.log('owner with attach');
        if (
          // eslint-disable-next-line no-prototype-builtins
          ticket.hasOwnProperty('ownerEmail')
        ) {
          expectedEmailTo = ticket.ownerEmail;
        } else {
          expectedEmailTo = ticket.email;
        }
        break;
      case 'OWNER_AS_CONSUMER':
        if (
          ticket.author === CONSUMER.user &&
          ticket.staffEmail === STAFF1.email &&
          ticket.user === CONSUMER.user &&
          !ticket.staffName &&
          !ticket.ownerEmail
        ) {
          expectedEmailTo = ticket.staffEmail;
        }
        break;
      case 'STAFF':
        if (
          // eslint-disable-next-line no-prototype-builtins
          ticket.hasOwnProperty('staffEmail')
        ) {
          expectedEmailTo = ticket.staffEmail;
        } else {
          expectedEmailTo = ticket.email;
        }
        break;
      case 'STAFF_WITH_ATTACH':
        if (
          // eslint-disable-next-line no-prototype-builtins
          ticket.hasOwnProperty('staffEmail')
        ) {
          expectedEmailTo = ticket.staffEmail;
        } else {
          expectedEmailTo = ticket.email;
        }
        break;
      case 'AS_STAFF':
        // eslint-disable-next-line no-console
        console.log('as staff in');
        if (
          ticket.author === OWNER.user &&
          ticket.name === STAFF1.user &&
          ticket.staffEmail === STAFF1.email
        ) {
          expectedEmailTo = ticket.staffEmail;
          // eslint-disable-next-line no-console
          console.log('expectedEmailTo in: ', expectedEmailTo);
        } else if (
          ticket.author === OWNER.user &&
          ticket.user === STAFF1.user &&
          ticket.staffEmail === STAFF1.email &&
          ticket.product === PRODUCT1
        ) {
          expectedEmailTo = ticket.staffEmail;
          // eslint-disable-next-line no-console
          console.log('expectedEmailTo in: ', expectedEmailTo);
        } else expectedEmailTo = ticket.email;
        break;
      case 'CONSUMER':
        expectedEmailTo = ticket.staffEmail;
        // eslint-disable-next-line no-console
        console.log('expectedEmailTo: ', expectedEmailTo);
        break;
      case 'CONSUMER_WITH_ATTACH':
        expectedEmailTo = ticket.staffEmail;
        // eslint-disable-next-line no-console
        console.log('expectedEmailTo: ', expectedEmailTo);
        break;
      case 'AS_CONSUMER':
        if (
          ticket.author === CONSUMER.user &&
          ticket.staffEmail === STAFF1.email &&
          ticket.user === CONSUMER.user &&
          !ticket.staffName &&
          !ticket.ownerEmail
        ) {
          expectedEmailTo = ticket.email;
        } else if (
          ticket.author === CONSUMER.user &&
          ticket.staffEmail === STAFF1.email &&
          ticket.user === STAFF1.user &&
          !ticket.staffName &&
          !ticket.ownerEmail
        ) {
          expectedEmailTo = ticket.email;
        } else if (
          ticket.author === CONSUMER.user &&
          ticket.user === CONSUMER.user &&
          !ticket.staffName
        ) {
          expectedEmailTo = ticket.email;
        } else expectedEmailTo = ticket.staffEmail;
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('invalid role');
        break;
    }

    // const emailTo = email.to;
    const emailTo = await this.getEmailAddressTo(email);
    // eslint-disable-next-line no-console
    console.log('Actual emailTo: ', emailTo);
    // eslint-disable-next-line no-console
    console.log('expectedEmailTo: ', expectedEmailTo);
    expect.soft(emailTo).toEqual(expectedEmailTo);
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailSubject(email) {
    const expectedEmailSubject = 'New ticket created';
    const emailSubject = email.subject;
    // eslint-disable-next-line no-console
    console.log('emailSubject: ', emailSubject);

    expect.soft(emailSubject).toEqual(expectedEmailSubject);
  }

  async checkEmailHeader(ticket, emailBody, role = '') {
    const expectedTicketName = await this.checkName(ticket, role);
    // eslint-disable-next-line no-console
    console.log('expectedTicketName: ', expectedTicketName);
    const expectedMailContentHeader = `Dear ${expectedTicketName}`;
    // eslint-disable-next-line no-console
    console.log('expectedMailContentHeader: ', expectedMailContentHeader);

    expect
      .soft(
        emailBody.includes(expectedMailContentHeader),
        `Expected ${expectedMailContentHeader}`,
      )
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderForConsumer(ticket, emailBody) {
    const expectedTicketAuthor = ticket.author;
    const expectedMailContentHeaderForConsumer = `Dear ${expectedTicketAuthor}`;
    // eslint-disable-next-line no-console
    console.log(
      'expectedMailContentHeaderForConsumer: ',
      expectedMailContentHeaderForConsumer,
    );

    expect
      .soft(
        emailBody.includes(expectedMailContentHeaderForConsumer),
        `Should be: Dear ${expectedTicketAuthor}`,
      )
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderForStaff(ticket, emailBody) {
    const expectedTicketAuthor =
      ticket.name && ticket.name !== 'None' ? ticket.name : ticket.user;
    // eslint-disable-next-line no-console
    console.log('expectedTicketAuthor: ', expectedTicketAuthor);
    const expectedMailContentHeaderForStaff = `Dear ${expectedTicketAuthor}`;
    // eslint-disable-next-line no-console
    console.log(
      'expectedMailContentHeaderForStaff: ',
      expectedMailContentHeaderForStaff,
    );

    expect
      .soft(
        emailBody.includes(
          expectedMailContentHeaderForStaff,
          `Email content should be to include ${expectedMailContentHeaderForStaff}`,
        ),
      )
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderAsStaff(ticket, emailBody) {
    let expectedTicketAuthor;
    if (ticket.author === OWNER.user && ticket.name === STAFF1.user) {
      expectedTicketAuthor = ticket.name;
    } else if (
      ticket.author === OWNER.user &&
      ticket.user === STAFF1.user &&
      ticket.product === PRODUCT1 &&
      ticket.staffEmail === STAFF1.email
    ) {
      expectedTicketAuthor = ticket.user;
    } else expectedTicketAuthor = ticket.author;

    const expectedMailContentHeaderAsStaff = `Dear ${expectedTicketAuthor}`;
    // eslint-disable-next-line no-console
    console.log(
      'expectedMailContentHeaderAsStaff: ',
      expectedMailContentHeaderAsStaff,
    );

    expect
      .soft(emailBody.includes(expectedMailContentHeaderAsStaff))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderText(ticket, emailBody) {
    const emailBodyContent = await emailBody;
    // eslint-disable-next-line no-console
    // console.log('ticket: ', ticket);
    // let expectedTicketAuthor;
    // if (role === 'CONSUMER_WITH_ATTACH') {
    //   expectedTicketAuthor = ticket.user;
    // } else if (role === 'OWNER_WITH_ATTACH') {
    //   expectedTicketAuthor = ticket.ownerName;
    // } else expectedTicketAuthor = ticket.author;
    const expectedTicketAuthor = ticket.author;
    const expectedHeaderTextMailTicket = `<p>${expectedTicketAuthor} has created a new Ticket  # `;
    // eslint-disable-next-line no-console
    console.log('expectedHeaderTextMailTicket: ', expectedHeaderTextMailTicket);

    expect
      .soft(emailBodyContent.includes(expectedHeaderTextMailTicket))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderTextForConsumer(emailBody) {
    const expectedHeaderTextMailTicketForConsumer = `<p> Ticket  # `;
    // eslint-disable-next-line no-console
    console.log(
      'expectedHeaderTextMailTicketForConsumer: ',
      expectedHeaderTextMailTicketForConsumer,
    );

    expect
      .soft(emailBody.includes(expectedHeaderTextMailTicketForConsumer))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailLogoLink(emailBody) {
    const expectedMailLogoLink = `<a href="${BASE_SYSTEM_URL}" target="_blank">`;
    // eslint-disable-next-line no-console
    console.log('expectedMailLogoLink: ', expectedMailLogoLink);

    expect.soft(emailBody.includes(expectedMailLogoLink)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderTicketLink(ticket, emailBody) {
    const expectedTicketUrl = ticket.url;
    const expectedTicketId = ticket.id;
    const expectedHeaderMailTicketLink = `<a href = ${expectedTicketUrl}>${expectedTicketId}</a>`;
    // eslint-disable-next-line no-console
    console.log('expectedHeaderMailTicketLink: ', expectedHeaderMailTicketLink);

    expect.soft(emailBody.includes(expectedHeaderMailTicketLink)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailDescription(ticket, emailBody) {
    const expectedTicketDescription = ticket.description;
    // eslint-disable-next-line no-console
    console.log('expectedTicketDescription: ', expectedTicketDescription);
    const expectedMailDescription = `<p>${expectedTicketDescription}</p>`;
    // eslint-disable-next-line no-console
    console.log('expectedMailDescription: ', expectedMailDescription);

    expect.soft(emailBody.includes(expectedMailDescription)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailDescriptionTicketLink(ticket, emailBody) {
    const expectedTicketId = ticket.id;
    const expectedTicketUrl = ticket.url;
    const expectedDescriptionMailTicketLink = `<a href = ${expectedTicketUrl}>test-kb.coworkplace.us/tickets/${expectedTicketId}</a>`;
    // eslint-disable-next-line no-console
    console.log(
      'expectedDescriptionMailTicketLink: ',
      expectedDescriptionMailTicketLink,
    );

    expect
      .soft(emailBody.includes(expectedDescriptionMailTicketLink))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIdForEmailReplay(ticket, emailBody) {
    const expectedDbId = ticket.dbId;
    const expectedIdForEmailReply = `<br> You can add your response to the ticket by replying to the email<br>[Do not remove this line] ##ID_${expectedDbId}##`;
    // eslint-disable-next-line no-console
    console.log('expectedIdForEmailReply: ', expectedIdForEmailReply);

    expect.soft(emailBody.includes(expectedIdForEmailReply)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHelpLink(emailBody) {
    const expectedMailHelpLink = 'https://tikit.info/home/online_help';
    // eslint-disable-next-line no-console
    console.log('expectedMailHelpLink: ', expectedMailHelpLink);

    expect.soft(emailBody.includes(expectedMailHelpLink)).toBeTruthy();
  }

  async checkEmailContent(ticket, email, role = '') {
    const createdTicket = await ticket;
    const receivedEmail = email;
    const emailBody = receivedEmail.body.html;
    // eslint-disable-next-line no-console
    // console.log('emailBody: ', emailBody);
    // if (
    //   receivedEmail.Content.Body.includes(
    //     'Content-Transfer-Encoding: quoted-printable\r\n',
    //   )
    // ) {
    //   emailBody = utf8.decode(
    //     quotedPrintable.decode(receivedEmail.Content.Body),
    //   );
    // } else emailBody = receivedEmail.Content.Body;
    // eslint-disable-next-line no-console
    // console.log('🚀emailBody', emailBody);

    switch (role) {
      case 'OWNER':
        await this.checkEmailFrom(email);
        await this.checkEmailSubject(email);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeader(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        // eslint-disable-next-line no-console
        console.log('OWNER');
        break;
      case 'OWNER_WITH_ATTACH':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeader(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody, role);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        await this.checkEmailAttachments(createdTicket, receivedEmail);
        // eslint-disable-next-line no-console
        console.log('OWNER_WITH_ATTACH');
        break;
      case 'OWNER_AS_CONSUMER':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeader(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        // eslint-disable-next-line no-console
        console.log('OWNER_AS_CONSUMER');
        break;
      case 'STAFF':
        // eslint-disable-next-line no-console
        // console.log('email: ', email);
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeaderForStaff(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        // eslint-disable-next-line no-console
        console.log('STAFF');
        break;
      case 'STAFF_WITH_ATTACH':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeaderForStaff(createdTicket, emailBody);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        await this.checkEmailAttachments(createdTicket, receivedEmail);
        // eslint-disable-next-line no-console
        console.log('STAFF_WITH_ATTACH');
        break;
      case 'AS_STAFF':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeaderAsStaff(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        // eslint-disable-next-line no-console
        console.log('AS STAFF');
        break;
      case 'CONSUMER':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeader(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        // eslint-disable-next-line no-console
        console.log('CONSUMER');
        break;
      case 'CONSUMER_WITH_ATTACH':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeader(createdTicket, emailBody, role);
        await this.checkEmailHeaderText(createdTicket, emailBody, role);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        await this.checkEmailAttachments(createdTicket, receivedEmail);
        // eslint-disable-next-line no-console
        console.log('CONSUMER_WITH_ATTACH');
        break;
      case 'AS_CONSUMER':
        await this.checkEmailFrom(receivedEmail);
        await this.checkEmailSubject(receivedEmail);
        await this.checkEmailTo(createdTicket, receivedEmail, role);
        await this.checkEmailHeaderForConsumer(ticket, emailBody);
        await this.checkEmailHeaderTextForConsumer(emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        // eslint-disable-next-line no-console
        console.log('AS_CONSUMER');
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('Invalid role name');
    }
  }

  // ===== Ticket Checking =====

  async checkCreatedTicketInfo(ticket) {
    await this.checkTicketUrl(ticket);
    await this.checkTicketCreator(ticket);
    await this.checkTicketProduct(ticket);
    await this.checkTicketPriority(ticket);
    await this.checkTicketAssignedTo(ticket);
    await this.checkTicketSubject(ticket);
    await this.checkTicketType(ticket);
    await this.checkTicketAttachments(ticket);
  }

  async checkCreatedTicketInfoByRole(ticket, role) {
    switch (role.name) {
      case 'OWNER':
        await this.checkTicketUrl(ticket);
        await this.checkTicketCreator(ticket);
        await this.checkTicketProduct(ticket);
        await this.checkTicketPriority(ticket);
        await this.checkTicketAssignedTo(ticket);
        await this.checkTicketSubject(ticket);
        await this.checkTicketType(ticket);
        await this.checkTicketAttachments(ticket);
        break;

      case 'STAFF':
        await this.checkTicketUrl(ticket);
        await this.checkTicketCreator(ticket);
        await this.checkTicketProduct(ticket);
        await this.checkTicketPriority(ticket);
        await this.checkTicketAssignedTo(ticket);
        await this.checkTicketSubject(ticket);
        await this.checkTicketType(ticket);
        await this.checkTicketAttachments(ticket);
        break;

      case 'CONSUMER':
        await this.checkTicketUrl(ticket);
        await this.checkTicketCreator(ticket);
        await this.checkTicketProduct(ticket);
        await this.checkTicketPriority(ticket);
        await this.checkTicketSubject(ticket);
        await this.checkTicketType(ticket);
        await this.checkTicketAttachments(ticket);
        break;

      default:
        // eslint-disable-next-line no-console
        console.log('Invalid role name');
    }
  }

  async checkEmailForCreatedTicket(ticket, role, emailsTo) {
    await this.checkTicketUrl(ticket);
    // if (ticket.attachments && ticket.attachments.length > 0) {
    //   // eslint-disable-next-line no-console
    //   console.log('before');
    //   await this.page.waitForTimeout(4000);
    //   // eslint-disable-next-line no-console
    //   console.log('after');
    // }
    const getEmails = await this.getEmails(ticket, role, emailsTo);
    const emails = getEmails;

    // eslint-disable-next-line no-console
    console.log('emails length: ', emails.length);

    expect.soft(emails.length > 0, 'Emails should be more than 0').toBeTruthy();

    switch (role) {
      case 'AS_OWNER':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'kbelozyorov@sysonline.com') {
            await this.checkEmailContent(ticket, email, 'OWNER');
          }

          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'AS_STAFF');
          }
        }
        break;
      case 'CONSUMER':
        // eslint-disable-next-line no-console
        // console.log('emails2: ', emails);
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'CONSUMER');
          }

          if (emailTo === 'kbelozyorov@sysonline.com') {
            await this.checkEmailContent(ticket, email, 'OWNER');
          }
        }
        break;
      case 'CONSUMER_WITH_ATTACH':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'CONSUMER_WITH_ATTACH');
          }

          if (emailTo === 'kbelozyorov@sysonline.com') {
            await this.checkEmailContent(ticket, email, 'OWNER_WITH_ATTACH');
          }
        }
        break;
      case 'AS_CONSUMER':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'test_belkos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'AS_CONSUMER');
          }

          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'OWNER');
          }
        }
        break;
      case 'OWNER_AS_CONSUMER':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'test_belkos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'AS_CONSUMER');
          }

          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'OWNER_AS_CONSUMER');
          }
        }
        break;
      case 'AS_STAFF':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'kos.aqa.kos@gmail.com') {
            await this.checkEmailContent(ticket, email, 'STAFF');
          }

          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'AS_STAFF');
          }
        }
        break;
      case 'STAFF_TO_STAFF':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'kbelozyorov@sysonline.com') {
            await this.checkEmailContent(ticket, email, 'OWNER');
          }

          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'STAFF');
          }
        }
        break;
      case 'STAFF_TO_STAFF_WITH_ATTACH':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'kbelozyorov@sysonline.com') {
            await this.checkEmailContent(ticket, email, 'OWNER_WITH_ATTACH');
          }

          if (emailTo === 'belozerov_kos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'STAFF_WITH_ATTACH');
          }
        }
        break;
      case 'STAFF_AS_CONSUMER':
        for await (const email of emails) {
          const emailTo = await this.getEmailAddressTo(email);
          // eslint-disable-next-line no-console
          console.log('email.to: ', emailTo);
          if (emailTo === 'test_belkos@ukr.net') {
            await this.checkEmailContent(ticket, email, 'AS_CONSUMER');
          }

          if (emailTo === 'kbelozyorov@sysonline.com') {
            await this.checkEmailContent(ticket, email, 'OWNER');
          }
        }
        break;
      default:
        for (const email of emails) {
          this.checkEmailContent(ticket, email, role);
        }
        break;
    }
  }

  async checkNoEmailForCreatedTicket(ticket, emailsTo) {
    // eslint-disable-next-line no-console
    // console.log('ticket: ', ticket);
    // const searchEmail = await this.getEmailFromSearch(ticket, role, emailsTo);
    const searchEmail = await this.getEmailsFromInbucket(
      ticket,
      // role,
      emailsTo,
    );
    // eslint-disable-next-line no-console
    console.log(
      '🚀 checkNoEmailForCreatedTicket ~ searchEmail: ',
      searchEmail[0],
    );
    let result = true;
    if (searchEmail.length > 0) {
      result = false;
    }

    expect.soft(result).toBeTruthy();
  }
}

module.exports = {
  TicketPage,
};
