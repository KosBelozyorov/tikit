const { LoginFragment } = require('./fragments/login');

/**
 * This is a Page Object Model (POM) class for the application's Todo page. It
 * provides locators and common operations that make writing tests easier.
 * @see https://playwright.dev/docs/test-pom
 */

const {
  COWORK_URL,
  STAFF_CREDENTIALS,
  OWNER_CREDENTIALS,
  CONSUMER_CREDENTIALS,
} = require('../../constants');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.LoginFragment = new LoginFragment(page);
  }

  async goto() {
    await this.page.goto(COWORK_URL);
  }

  async loginAsStaff() {
    const { email, password } = STAFF_CREDENTIALS;
    await this.LoginFragment.login(email, password);
  }

  async loginAsOwner() {
    const { email, password } = OWNER_CREDENTIALS;
    await this.LoginFragment.login(email, password);
  }

  async loginAsConsumer() {
    const { email, password } = CONSUMER_CREDENTIALS;
    await this.LoginFragment.login(email, password);
  }
}

module.exports = {
  LoginPage,
};
