const { expect } = require("@playwright/test");

const {
  // DEV_MAIN_PAGE_URL,
  // ALL_PRODUCTS_BUTTON,
  // CLOSE_POP_UP_BUTTON,
} = require("../../constants");

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
  }
}

module.exports = {
  LoginPage,
};
