const { expect } = require('@playwright/test');
const axios = require('axios');
const mailhog = require('mailhog')({
  host: 'rig.sysonline.com',
  port: 8025,
});
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
    await this.ticketCreatedShowAttach.click();
    const actualAttachments =
      await this.ticketCreatedWithAttach.allTextContents();

    const expectedAttachments = await ticket.attachments;

    expect
      .soft(await this.equalArrays(expectedAttachments, actualAttachments))
      .toBeTruthy();
  }

  // ===== Email Checking =====

  // eslint-disable-next-line class-methods-use-this
  async getEmailFromSearch(ticket) {
    const subject = await ticket.subject;
    const email = await mailhog.search(subject, 'containing');

    return email;
  }

  // eslint-disable-next-line class-methods-use-this
  async getEmailAddressFrom(email) {
    // eslint-disable-next-line no-useless-escape
    const regex = /(?<=\<)[^>]+(?=\>)/g;
    const emailFrom = await email.from.match(regex)[0];

    return emailFrom;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAttachmentsFrom(email) {
    const emailAttachments = await email.attachments;
    // eslint-disable-next-line no-console
    console.log('email attach: ', emailAttachments);
    const attachmentsList = emailAttachments.map(item => item.name);

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
  async checkName(obj) {
    if (obj.name === 'None' && obj.user) {
      return obj.user;
    }

    // eslint-disable-next-line no-prototype-builtins
    if (!obj.hasOwnProperty('name')) {
      return obj.author;
    }

    return obj.name;
  }

  async getEmails(ticket) {
    await this.getTicketIdFromDB(ticket);

    const createdTicket = await ticket;
    const searchEmail = await this.getEmailFromSearch(createdTicket);

    return searchEmail;
  }

  /*
   * Assertions
   */

  async checkEmailAttachments(ticket, email) {
    const emailAttachments = await this.getAttachmentsFrom(email);
    const expectedMailAttachments = ticket.attachments;

    expect
      .soft(await this.equalArrays(expectedMailAttachments, emailAttachments))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailFrom(email) {
    const emailFrom = `${email.From.Mailbox}@${email.From.Domain}`;
    const expectedEmailFrom = EMAIL_FROM;

    expect.soft(emailFrom).toEqual(expectedEmailFrom);
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailTo(ticket, email) {
    const expectedEmailTo = ticket.email;
    const emailTo = email.to;

    expect.soft(emailTo).toEqual(expectedEmailTo);
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailSubject(email) {
    const expectedEmailSubject = 'New ticket created';
    const emailSubject = email.subject;

    expect.soft(emailSubject).toEqual(expectedEmailSubject);
  }

  async checkEmailHeader(ticket, emailBody) {
    const expectedTicketName = await this.checkName(ticket);
    const expectedMailContentHeader = `Dear ${expectedTicketName}`;

    expect.soft(emailBody.includes(expectedMailContentHeader)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderForConsumer(ticket, emailBody) {
    const expectedTicketAuthor = ticket.author;
    const expectedMailContentHeaderForConsumer = `Dear ${expectedTicketAuthor}`;

    expect
      .soft(emailBody.includes(expectedMailContentHeaderForConsumer))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderText(ticket, emailBody) {
    const expectedTicketAuthor = ticket.author;
    const expectedHeaderTextMailTicket = `<p>${expectedTicketAuthor} has created a new Ticket  #`;

    expect.soft(emailBody.includes(expectedHeaderTextMailTicket)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderTextForConsumer(emailBody) {
    const expectedHeaderTextMailTicketForConsumer = `<p> Ticket  # `;

    expect
      .soft(emailBody.includes(expectedHeaderTextMailTicketForConsumer))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailLogoLink(emailBody) {
    const expectedMailLogoLink = `<a href="${BASE_SYSTEM_URL}" target="_blank">`;

    expect.soft(emailBody.includes(expectedMailLogoLink)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHeaderTicketLink(ticket, emailBody) {
    const expectedTicketUrl = ticket.url;
    const expectedTicketId = ticket.id;
    const expectedHeaderMailTicketLink = `<a href = ${expectedTicketUrl}>${expectedTicketId}</a>`;

    expect.soft(emailBody.includes(expectedHeaderMailTicketLink)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailDescription(ticket, emailBody) {
    const expectedTicketDescription = ticket.description;
    const expectedMailDescription = `<p>${expectedTicketDescription}</p>`;

    expect.soft(emailBody.includes(expectedMailDescription)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailDescriptionTicketLink(ticket, emailBody) {
    const expectedTicketId = ticket.id;
    const expectedTicketUrl = ticket.url;
    const expectedDescriptionMailTicketLink = `<a href = ${expectedTicketUrl}>test-kb.coworkplace.us/tickets/${expectedTicketId}</a>`;

    expect
      .soft(emailBody.includes(expectedDescriptionMailTicketLink))
      .toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIdForEmailReplay(ticket, emailBody) {
    const expectedDbId = ticket.dbId;
    const expectedIdForEmailReply = `<br> You can add your response to the ticket by replying to the email<br>[Do not remove this line] ##ID_${expectedDbId}##`;

    expect.soft(emailBody.includes(expectedIdForEmailReply)).toBeTruthy();
  }

  // eslint-disable-next-line class-methods-use-this
  async checkEmailHelpLink(emailBody) {
    const expectedMailHelpLink = 'https://tikit.info/home/online_help';

    expect.soft(emailBody.includes(expectedMailHelpLink)).toBeTruthy();
  }

  async checkEmailContent(ticket, email, role = '') {
    const createdTicket = await ticket;
    await email;
    const emailBody = email.Content.Body;

    switch (role) {
      case 'OWNER':
        await this.checkEmailFrom(email);
        await this.checkEmailSubject(email);
        await this.checkEmailTo(createdTicket, email);
        await this.checkEmailHeader(createdTicket, emailBody);
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
        await this.checkEmailFrom(email);
        await this.checkEmailSubject(email);
        await this.checkEmailTo(createdTicket, email);
        await this.checkEmailHeader(createdTicket, emailBody);
        await this.checkEmailHeaderText(createdTicket, emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        await this.checkEmailAttachments(createdTicket, email);
        // eslint-disable-next-line no-console
        console.log('OWNER_WITH_ATTACH');
        break;
      case 'CONSUMER':
        await this.checkEmailFrom(email);
        await this.checkEmailSubject(email);
        await this.checkEmailTo(createdTicket, email);
        await this.checkEmailHeaderForConsumer(ticket, emailBody);
        await this.checkEmailHeaderTextForConsumer(emailBody);
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
        await this.checkEmailFrom(email);
        await this.checkEmailSubject(email);
        await this.checkEmailTo(createdTicket, email);
        await this.checkEmailHeaderForConsumer(ticket, emailBody);
        await this.checkEmailHeaderTextForConsumer(emailBody);
        await this.checkEmailLogoLink(emailBody);
        await this.checkEmailHeaderTicketLink(createdTicket, emailBody);
        await this.checkEmailDescription(createdTicket, emailBody);
        await this.checkEmailDescriptionTicketLink(ticket, emailBody);
        await this.checkIdForEmailReplay(ticket, emailBody);
        await this.checkEmailHelpLink(emailBody);
        await this.checkEmailAttachments(createdTicket, email);
        // eslint-disable-next-line no-console
        console.log('CONSUMER_WITH_ATTACH');
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

  async checkEmailForCreatedTicket(ticket, role) {
    await this.checkTicketUrl(ticket);
    const emails = (await this.getEmails(ticket)).items;

    if (emails.length > 1 && role === 'AS_CONSUMER') {
      // const consumerEmail = emails.filter(item => item.to === ticket.email);

      const consumerEmail = {};
      consumerEmail.items = emails.filter(
        item => item.to === 'test_belkos@ukr.net',
      );

      // eslint-disable-next-line no-console
      // console.log('consumerEmail.to: ', consumerEmail.items);
      await this.checkEmailContent(ticket, consumerEmail.items[0], 'CONSUMER');

      const staffEmail = {
        ...emails.filter(item => item.to === ticket.staffEmail)[0],
      };
      await this.checkEmailContent(ticket, staffEmail, 'OWNER');
    }

    for (const email of emails) {
      this.checkEmailContent(ticket, email, role);
    }
  }

  async checkNoEmailForCreatedTicket(ticket) {
    const searchEmail = await this.getEmailFromSearch(ticket);
    let result = true;
    if (searchEmail.items.length > 0) {
      result = false;
    }

    expect.soft(result).toBeTruthy();
  }
}

module.exports = {
  TicketPage,
};
