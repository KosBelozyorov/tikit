const {
  COWORK_URL,
  LOGIN_FORM_EMAIL,
  LOGIN_FORM_PASSWORD,
  LOGIN_FORM_BUTTON,
  STAFF_CREDENTIALS,
} = require('../../constants');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.nameInputField = this.page.locator(LOGIN_FORM_EMAIL);
    this.passwordInputField = this.page.locator(LOGIN_FORM_PASSWORD);
    this.loginFormButton = this.page.locator(LOGIN_FORM_BUTTON);
  }

  async goto() {
    await this.page.goto(COWORK_URL);
  }

  async login() {
    await this.nameInputField.click();
    await this.nameInputField.fill(STAFF_CREDENTIALS.email);
    await this.passwordInputField.fill(STAFF_CREDENTIALS.password);
    await Promise.all([
      this.page.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/' } */),
      await this.loginFormButton.click(),
    ]);
  }
}

module.exports = {
  LoginPage,
};
