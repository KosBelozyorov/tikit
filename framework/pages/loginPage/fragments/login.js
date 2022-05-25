const {
  LOGIN_FORM_EMAIL,
  LOGIN_FORM_PASSWORD,
  LOGIN_FORM_BUTTON,
} = require('../../../constants');

class LoginFragment {
  constructor(page) {
    this.page = page;
    this.emailInputField = this.page.locator(LOGIN_FORM_EMAIL);
    this.passwordInputField = this.page.locator(LOGIN_FORM_PASSWORD);
    this.loginFormButton = this.page.locator(LOGIN_FORM_BUTTON);
  }

  async login(userName, password) {
    await this.emailInputField.click();
    await this.emailInputField.fill(userName);
    await this.passwordInputField.click();
    await this.passwordInputField.fill(password);
    await Promise.all([
      await this.loginFormButton.click(),
      await this.page.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/tickets' } */),
    ]);
  }

  async gotoLoginPage() {
    const pageUrl = await this.page.url();

    return pageUrl;
  }
}

module.exports = {
  LoginFragment,
};
