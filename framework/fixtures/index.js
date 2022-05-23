const base = require('@playwright/test');
const { LoginPage, TicketsPage } = require('..');

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
});

module.exports = {
  test,
  expect,
};
