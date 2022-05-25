const { ADD_NEW_BUTTON, ADD_NEW_TICKET_BUTTON } = require('../../constants');

class TicketsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.addNewButton = this.page.locator(ADD_NEW_BUTTON);
    this.addNewTicketButton = this.page.locator(ADD_NEW_TICKET_BUTTON);
  }

  async openFormAddNewTicket() {
    await this.addNewButton.click();
    await this.addNewTicketButton.click();
  }
}

module.exports = {
  TicketsPage,
};
