const base = require('@playwright/test');
const { LoginPage, TicketsPage, TicketPage, NewTicketPage } = require('..');

const { expect } = base;

const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  ticketsPage: async ({ page }, use) => {
    const ticketsPage = new TicketsPage(page);
    await use(ticketsPage);
  },
  ticketPage: async ({ page }, use) => {
    const ticketPage = new TicketPage(page);
    await use(ticketPage);
  },
  newTicketPage: async ({ page }, use) => {
    const newTicketPage = new NewTicketPage(page);
    await use(newTicketPage);
  },
});

module.exports = {
  test,
  expect,
};
