const { expect } = require('@playwright/test');

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

    this.ticket = { ...this.myObject };
  }

  async getContactName() {
    const fullContactNameField =
      await this.newTicketFormContactField.textContent();
    const contactName = fullContactNameField.split(' - ')[0];
    this.ticket.name = contactName;

    return contactName;
  }

  async checkTicketCreator(ticket) {
    await expect.soft(this.ticketCreatedBy).toHaveText(await ticket.name);
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
      .toHaveText(await ticket.user);
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
    await expect(this.ticketCreatedWithAttach).toHaveText(
      await ticket.attachments,
    );
  }

  async checkCreatedTicketInfo(ticket) {
    await this.page.waitForLoadState();
    await this.page
      .locator(
        `.card-wrap.select-all__box label:has-text("${await ticket.subject}")`,
      )
      .click();

    await this.checkTicketCreator(ticket);
    await this.checkTicketProduct(ticket);
    await this.checkTicketPriority(ticket);
    await this.checkTicketAssignedTo(ticket);
    await this.checkTicketSubject(ticket);
    await this.checkTicketType(ticket);
    await this.checkTicketAttachments(ticket);
  }
}

module.exports = {
  TicketPage,
};
