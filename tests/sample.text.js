const { test } = require('../framework/fixtures');

test('test', async ({ page }) => {
  // Go to https://test-kb.coworkplace.us/
  await page.goto('https://test-kb.coworkplace.us/');

  // Go to https://test-kb.coworkplace.us/login-form
  await page.goto('https://test-kb.coworkplace.us/login-form');

  // Click text=Email Password >> input[name="email"]
  await page.locator('text=Email Password >> input[name="email"]').click();

  // Fill text=Email Password >> input[name="email"]
  await page
    .locator('text=Email Password >> input[name="email"]')
    .fill('kbelozyorov@sysonline.com');

  // Press Tab
  await page.locator('text=Email Password >> input[name="email"]').press('Tab');

  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill('2MLZ9DtyXnnnMq5');

  // Click button:has-text("Sign In")
  await Promise.all([
    page.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/' } */),
    page.locator('button:has-text("Sign In")').click(),
  ]);

  // Go to https://test-kb.coworkplace.us/tickets
  await page.goto('https://test-kb.coworkplace.us/tickets');

  // Click text=NewNew ticketNew groupNew staffNew consumer userNew company >> button
  await page
    .locator(
      'text=NewNew ticketNew groupNew staffNew consumer userNew company >> button',
    )
    .click();

  // Click text=New ticketNew groupNew staffNew consumer userNew company >> label >> nth=0
  await page
    .locator(
      'text=New ticketNew groupNew staffNew consumer userNew company >> label',
    )
    .first()
    .click();

  // Click text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="title"]
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="title"]',
    )
    .click();

  // Fill text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="title"]
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="title"]',
    )
    .fill('codegen');

  // Press Home with modifiers
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="title"]',
    )
    .press('Shift+Home');

  // Press c with modifiers
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="title"]',
    )
    .press('Control+c');

  // Click text=test product test product2 -- -- Required field >> span[role="textbox"]
  await page
    .locator(
      'text=test product test product2 -- -- Required field >> span[role="textbox"]',
    )
    .click();

  // Click #select2-product-o2-result-qhej-326
  await page.locator('#select2-product-o2-result-qhej-326').click();

  // Click text=Topic Test topic-- >> span[role="textbox"]
  await page.locator('text=Topic Test topic-- >> span[role="textbox"]').click();

  // Click li[role="option"]:has-text("Test topic")
  await page.locator('li[role="option"]:has-text("Test topic")').click();

  // Click #createTicket >> text=Nonetest staffKostya BelozyorovNone >> span[role="presentation"]
  await page
    .locator(
      '#createTicket >> text=Nonetest staffKostya BelozyorovNone >> span[role="presentation"]',
    )
    .click();

  // Click li[role="option"]:has-text("test staff")
  await page.locator('li[role="option"]:has-text("test staff")').click();

  // Click text=Urgent High Medium Low Medium >> span[role="textbox"]
  await page
    .locator('text=Urgent High Medium Low Medium >> span[role="textbox"]')
    .click();

  // Click li[role="option"]:has-text("Urgent")
  await page.locator('li[role="option"]:has-text("Urgent")').click();

  // Click text=Task Feature Incident Problem Question Question >> span[role="textbox"]
  await page
    .locator(
      'text=Task Feature Incident Problem Question Question >> span[role="textbox"]',
    )
    .click();

  // Click li[role="option"]:has-text("Task")
  await page.locator('li[role="option"]:has-text("Task")').click();

  // Click text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> p
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> p',
    )
    .click();

  // Click text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="files"]
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="files"]',
    )
    .click();

  // Upload CycleStreetsMobileAppSpecification.pdf
  await page
    .locator(
      'text=New Ticket Contact * Kostya Belozyorov - kbelozyorov@sysonline.com Kostya Belozy >> input[name="files"]',
    )
    .setInputFiles('CycleStreetsMobileAppSpecification.pdf');

  // Click #createTicket >> text=Save Changes
  await page.locator('#createTicket >> text=Save Changes').click();

  // Go to https://test-kb.coworkplace.us/tickets
  await page.goto('https://test-kb.coworkplace.us/tickets');

  // Click text=codegen >> nth=2
  await page.locator('text=codegen').nth(2).click();
  await expect(page).toHaveURL('https://test-kb.coworkplace.us/tickets/944');

  // Click text=All files: CycleStreetsMobileAppSpecification.pdf 1.67 MB Open Pending Resolved  >> button
  await page
    .locator(
      'text=All files: CycleStreetsMobileAppSpecification.pdf 1.67 MB Open Pending Resolved  >> button',
    )
    .click();
});
