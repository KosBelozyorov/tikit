const { expect } = require('@playwright/test');
const { LoginFragment } = require('./fragments/login');

/**
 * This is a Page Object Model (POM) class for the application's Todo page. It
 * provides locators and common operations that make writing tests easier.
 * @see https://playwright.dev/docs/test-pom
 */

const {
  COWORK_URL,
  STAFF,
  OWNER,
  CONSUMER,
  SIDEBAR_PROFILE_OPEN_BUTTON,
  SIDEBAR_SIGNOUT_BUTTON,
} = require('../../constants');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.LoginFragment = new LoginFragment(page);
    this.openSidebarProfileButton = this.page.locator(
      SIDEBAR_PROFILE_OPEN_BUTTON,
    );
    this.sidebarProfileSignOutButton = this.page.locator(
      SIDEBAR_SIGNOUT_BUTTON,
    );
  }

  async goto() {
    await this.page.goto(COWORK_URL);
  }

  async loginAs(user) {
    const { email, password } = user;
    await this.LoginFragment.login(email, password);
  }

  async loginAsStaff() {
    const { email, password } = STAFF;
    await this.LoginFragment.login(email, password);
  }

  async loginAsOwner() {
    const { email, password } = OWNER;
    await this.LoginFragment.login(email, password);
  }

  async loginAsConsumer() {
    const { email, password } = CONSUMER;
    await this.LoginFragment.login(email, password);
  }

  async logout() {
    this.openSidebarProfileButton.click();
    await Promise.all([
      await this.sidebarProfileSignOutButton.click(),
      await this.page.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/login-form' } */),
    ]);
    await expect
      .soft(this.page)
      .toHaveURL('https://test-kb.coworkplace.us/login-form');
  }
}

module.exports = {
  LoginPage,
};
