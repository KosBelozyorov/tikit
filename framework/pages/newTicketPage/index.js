const { expect } = require('@playwright/test');

const {
  NEW_TICKET_FORM_CONTACT_FIELD,
  NEW_TICKET_FORM_CONTACT_SEARCH_FIELD,
  NEW_TICKET_FORM_SUBJECT_FIELD,
  NEW_TICKET_FORM_PRODUCT_FIELD,
  NEW_TICKET_FORM_SEARCH_PRODUCT_FIELD,
  NEW_TICKET_FORM_TOPIC_FIELD,
  NEW_TICKET_FORM_SEARCH_TOPIC_FIELD,
  NEW_TICKET_FORM_ASSIGNED_FIELD,
  NEW_TICKET_FORM_SEARCH_ASSIGNED_FIELD,
  NEW_TICKET_FORM_PRIORITY_FIELD,
  NEW_TICKET_FORM_TYPE_FIELD,
  NEW_TICKET_FORM_FIELD_OPTIONS,
  NEW_TICKET_FORM_DESCRIPTION_FIELD,
  NEW_TICKET_FORM_FILES_UPLOAD,
  NEW_TICKET_FORM_SAVE_BUTTON,
} = require('../../constants');

class NewTicketPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    this.newTicketFormContactField = this.page
      .locator(NEW_TICKET_FORM_CONTACT_FIELD)
      .first();
    this.newTicketFormContactSearchField = this.page.locator(
      NEW_TICKET_FORM_CONTACT_SEARCH_FIELD,
    );
    this.newTicketFormSubjectField = this.page.locator(
      NEW_TICKET_FORM_SUBJECT_FIELD,
    );
    this.newTicketFormProductField = this.page
      .locator(NEW_TICKET_FORM_PRODUCT_FIELD)
      .first();
    this.newTicketFormSearchProductField = this.page.locator(
      NEW_TICKET_FORM_SEARCH_PRODUCT_FIELD,
    );
    this.newTicketFormTopicField = this.page
      .locator(NEW_TICKET_FORM_TOPIC_FIELD)
      .nth(1);
    this.newTicketFormSearchPTopicField = this.page.locator(
      NEW_TICKET_FORM_SEARCH_TOPIC_FIELD,
    );
    this.newTicketFormAssignedField = this.page
      .locator(NEW_TICKET_FORM_ASSIGNED_FIELD)
      .first();
    this.newTicketFormSearchAssignedField = this.page
      .locator(NEW_TICKET_FORM_SEARCH_ASSIGNED_FIELD)
      .first();

    this.newTicketFormPriorityField = this.page.locator(
      NEW_TICKET_FORM_PRIORITY_FIELD,
    );
    this.newTicketFormOptions = this.page.locator(
      NEW_TICKET_FORM_FIELD_OPTIONS,
    );
    this.newTicketFormTypeField = this.page.locator(NEW_TICKET_FORM_TYPE_FIELD);
    this.newTicketFormDescriptionField = this.page
      .locator(NEW_TICKET_FORM_DESCRIPTION_FIELD)
      .first();
    this.newTicketFormFilesUpload = this.page
      .locator(NEW_TICKET_FORM_FILES_UPLOAD)
      .first();
    this.newTicketFormSaveButton = this.page.locator(
      NEW_TICKET_FORM_SAVE_BUTTON,
    );

    this.ticket = {};
  }

  // eslint-disable-next-line class-methods-use-this
  async getElementsAmount(elemLocator, modifier = 0) {
    const result = await elemLocator.count();

    return result - modifier;
  }

  async getRandomValue(elemLocator, modifier = 0) {
    const elementsAmount = await this.getElementsAmount(elemLocator, modifier);
    const x = Math.floor(Math.random() * elementsAmount + 1);

    return x;
  }

  async getContactName() {
    const fullContactNameField =
      await this.newTicketFormContactField.textContent();
    const contactName = fullContactNameField.split(' - ')[0];

    this.ticket.name = contactName;

    return contactName;
  }

  async getRandomOptionName(optionsLocator, modifier) {
    const optionItemId = this.getRandomValue(
      await optionsLocator,
      await modifier,
    );
    const optionItemLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await optionItemId})`;
    const optionName = await this.page.locator(optionItemLocator).textContent();

    return optionName;
  }

  // eslint-disable-next-line class-methods-use-this
  async searchInOptions(fieldLocator, option) {
    // const optionName = await this.getRandomOptionName(
    //   await optionsLocator,
    //   modifier,
    // );
    await fieldLocator.type(option, { delay: 20 });

    return option;
  }

  async selectRandomOption(fieldLocator, optionsLocator, modifier) {
    const randomOptionName = await this.getRandomOptionName(
      await optionsLocator,
      modifier,
    );
    const optionName = await this.searchInOptions(
      fieldLocator,
      randomOptionName,
    );
    const optionSelectorFromSearchList = `li[role="option"]:has-text('${optionName}')`;
    const optionNameFromSearchList = this.page
      .locator(optionSelectorFromSearchList)
      .first();

    await expect(optionNameFromSearchList).toHaveText(optionName);
    await optionNameFromSearchList.click();

    return optionName;
  }

  async selectCustomOption(fieldLocator, customOptionName) {
    const optionName = await this.searchInOptions(
      fieldLocator,
      customOptionName,
    );
    const optionSelectorFromSearchList = `li[role="option"]:has-text('${optionName}')`;
    const optionNameFromSearchList = this.page
      .locator(optionSelectorFromSearchList)
      .first();

    await expect(optionNameFromSearchList).toHaveText(optionName);
    await optionNameFromSearchList.click();

    return optionName;
  }

  async FillContactField(name) {
    if (name) {
      await this.selectCustomOption(this.newTicketFormContactSearchField, name);
    }
    this.getContactName();
  }

  async FillSubjectField() {
    const subjectText = `New ticket ${Date()}`;
    await this.newTicketFormSubjectField.click();
    await this.newTicketFormSubjectField.fill(subjectText);

    this.ticket.subject = subjectText;
  }

  async SelectProduct() {
    await this.newTicketFormProductField.click();
    await this.newTicketFormSearchProductField.click();
    this.ticket.product = await this.selectRandomOption(
      this.newTicketFormSearchProductField,
      this.newTicketFormOptions,
      1,
    );
  }

  async SelectTopic() {
    await this.newTicketFormTopicField.click();
    await this.newTicketFormSearchPTopicField.click();
    this.ticket.topic = await this.selectRandomOption(
      this.newTicketFormSearchPTopicField,
      this.newTicketFormOptions,
    );
  }

  async SelectUser() {
    await this.newTicketFormAssignedField.click();
    await this.newTicketFormSearchAssignedField.click();
    this.ticket.user = await this.selectRandomOption(
      this.newTicketFormSearchAssignedField,
      this.newTicketFormOptions,
      1,
    );
  }

  async SelectPriorityOption() {
    await this.newTicketFormPriorityField.click();
    const elementId = this.getRandomValue(this.newTicketFormOptions);
    const elementLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await elementId})`;

    this.ticket.priority = await this.page
      .locator(elementLocator)
      .textContent();

    await this.page.locator(elementLocator).click();
  }

  async SelectTypeOption() {
    await this.newTicketFormTypeField.click();
    const elementId = this.getRandomValue(this.newTicketFormOptions);
    const elementLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await elementId})`;

    this.ticket.type = await this.page.locator(elementLocator).textContent();

    await this.page.locator(elementLocator).click();
  }

  async FillDescriptionField() {
    await this.newTicketFormDescriptionField.click();
    const descriptionText =
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. A itaque quisquam optio laboriosam illo? Impedit sed numquam eos optio saepe aut laudantium dolorem voluptatem minus, ducimus animi voluptate magni voluptatum odit quisquam enim earum reiciendis officia similique vitae quibusdam? Molestias rem itaque laboriosam architecto labore voluptas atque, tempora magni eum?';

    await this.newTicketFormDescriptionField.fill(descriptionText);

    this.ticket.description = descriptionText;
  }

  async UploadFiles() {
    await this.newTicketFormFilesUpload.setInputFiles(
      [
        '../../../FilesToUpload/man.png',
        // '../../../FilesToUpload/CycleStreetsMobileAppSpecification.pdf',
        // '../../../FilesToUpload/test-data-file.xlsx',
      ],
      { timeout: 5000 },
    );

    this.ticket.attachments = ['man.png'];
    await this.page.waitForTimeout(5000);
  }

  async SaveNewTicket() {
    await Promise.all([
      await this.newTicketFormSaveButton.click(),
      this.page.waitForNavigation(/* { url: 'https://test-kb.coworkplace.us/tickets/' } */),
    ]);

    return this.ticket;
  }

  async fillNewTicketForm() {
    await this.FillContactField();
    await this.FillSubjectField();
    await this.SelectProduct();
    await this.SelectTopic();
    await this.SelectUser();
    await this.SelectPriorityOption();
    await this.SelectTypeOption();
    await this.FillDescriptionField();
    await this.UploadFiles();
  }
}

module.exports = {
  NewTicketPage,
};
