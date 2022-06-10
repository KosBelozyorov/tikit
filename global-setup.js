const { chromium } = require('@playwright/test');
const {
  COWORK_URL,
  // STAFF,
  OWNER,
  // CONSUMER,
  LOGIN_FORM_EMAIL,
  LOGIN_FORM_PASSWORD,
  LOGIN_FORM_BUTTON,
} = require('./framework/constants');

// eslint-disable-next-line no-unused-vars
module.exports = async config => {
  const browser = await chromium.launch();

  // OWNER
  const ownerLoginPage = await browser.newPage();

  const emailInputField = ownerLoginPage.locator(LOGIN_FORM_EMAIL);
  const passwordInputField = ownerLoginPage.locator(LOGIN_FORM_PASSWORD);
  const loginFormButton = ownerLoginPage.locator(LOGIN_FORM_BUTTON);

  // ... log in as OWNER
  await ownerLoginPage.goto(COWORK_URL);
  await emailInputField.click();
  await emailInputField.fill(OWNER.email);
  await passwordInputField.click();
  await passwordInputField.fill(OWNER.password);
  await Promise.all([
    await loginFormButton.click(),
    await ownerLoginPage.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/tickets' } */),
  ]);
  await ownerLoginPage
    .context()
    .storageState({ path: './testCredentials/ownerStorageState.json' });

  // STAFF
  // const staffLoginPage = await browser.newPage();
  // const staffEmailInputField = staffLoginPage.locator(LOGIN_FORM_EMAIL);
  // const staffPasswordInputField = staffLoginPage.locator(LOGIN_FORM_PASSWORD);
  // const staffLoginFormButton = staffLoginPage.locator(LOGIN_FORM_BUTTON);
  // // ... log in as STAFF
  // await staffLoginPage.goto(COWORK_URL);
  // await staffEmailInputField.click();
  // await staffEmailInputField.fill(STAFF.email);
  // await staffPasswordInputField.click();
  // await staffPasswordInputField.fill(STAFF.password);
  // await Promise.all([
  //   await staffLoginFormButton.click(),
  //   await staffLoginPage.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/tickets' } */),
  // ]);
  // await staffLoginPage
  //   .context()
  //   .storageState({ path: './testCredentials/staffStorageState.json' });

  // // CONSUMER
  // const consumerLoginPage = await browser.newPage();
  // const consumerEmailInputField = consumerLoginPage.locator(LOGIN_FORM_EMAIL);
  // const consumerPasswordInputField =
  //   consumerLoginPage.locator(LOGIN_FORM_PASSWORD);
  // const consumerLoginFormButton = consumerLoginPage.locator(LOGIN_FORM_BUTTON);
  // // ... log in as CONSUMER
  // await consumerLoginPage.goto(COWORK_URL);
  // await consumerEmailInputField.click();
  // await consumerEmailInputField.fill(CONSUMER.email);
  // await consumerPasswordInputField.click();
  // await consumerPasswordInputField.fill(CONSUMER.password);
  // await Promise.all([
  //   await consumerLoginFormButton.click(),
  //   await consumerLoginPage.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/tickets' } */),
  // ]);
  // await staffLoginPage
  //   .context()
  //   .storageState({ path: './testCredentials/consumerStorageState.json' });
  await browser.close();
};
