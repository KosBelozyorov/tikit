const { expect } = require('@playwright/test');

const {
  ADD_NEW_BUTTON,
  ADD_NEW_TICKET_BUTTON,
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

class TicketsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.addNewButton = this.page.locator(ADD_NEW_BUTTON);
    this.addNewTicketButton = this.page.locator(ADD_NEW_TICKET_BUTTON);
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
  }

  async openFormAddNewTicket() {
    await this.addNewButton.click();
    await this.addNewTicketButton.click();
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

  async getOptionName(optionsLocator, modifier) {
    const optionItemId = this.getRandomValue(
      await optionsLocator,
      await modifier,
    );
    const optionItemLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await optionItemId})`;
    const optionName = await this.page.locator(optionItemLocator).textContent();

    return optionName;
  }

  async searchInOptions(fieldLocator, optionsLocator, modifier) {
    const optionName = await this.getOptionName(await optionsLocator, modifier);
    await fieldLocator.type(optionName, { delay: 50 });

    return optionName;
  }

  async selectOption(fieldLocator, optionsLocator, modifier) {
    const optionName = await this.searchInOptions(
      fieldLocator,
      optionsLocator,
      modifier,
    );
    const optionSelectorFromSearchList = `li[role="option"]:has-text('${optionName}')`;
    const optionNameFromSearchList = this.page
      .locator(optionSelectorFromSearchList)
      .first();

    await expect(optionNameFromSearchList).toHaveText(optionName);
    await optionNameFromSearchList.click();
  }

  async SelectProduct() {
    await this.newTicketFormProductField.click();
    await this.newTicketFormSearchProductField.click();
    await this.selectOption(
      this.newTicketFormSearchProductField,
      this.newTicketFormOptions,
      1,
    );
  }

  async SelectTopic() {
    await this.newTicketFormTopicField.click();
    await this.newTicketFormSearchPTopicField.click();
    await this.selectOption(
      this.newTicketFormSearchPTopicField,
      this.newTicketFormOptions,
    );
  }

  async SelectUser() {
    await this.newTicketFormAssignedField.click();
    await this.newTicketFormSearchAssignedField.click();
    await this.selectOption(
      this.newTicketFormSearchAssignedField,
      this.newTicketFormOptions,
      1,
    );
  }

  async SelectPriorityOption() {
    await this.newTicketFormPriorityField.click();
    const elementId = this.getRandomValue(this.newTicketFormOptions);
    const elementLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await elementId})`;

    await this.page.locator(elementLocator).click();
  }

  async SelectTypeOption() {
    await this.newTicketFormTypeField.click();
    const elementId = this.getRandomValue(this.newTicketFormOptions);
    const elementLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await elementId})`;

    await this.page.locator(elementLocator).click();
  }

  async FillSubjectField() {
    const subjectText = `New ticket ${Date()}`;
    await this.newTicketFormSubjectField.click();
    await this.newTicketFormSubjectField.fill(subjectText);
  }

  async FillDescriptionField() {
    await this.newTicketFormDescriptionField.click();
    const descriptionText =
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. A itaque quisquam optio laboriosam illo? Impedit sed numquam eos optio saepe aut laudantium dolorem voluptatem minus, ducimus animi voluptate magni voluptatum odit quisquam enim earum reiciendis officia similique vitae quibusdam? Molestias rem itaque laboriosam architecto labore voluptas atque, tempora magni eum?';

    await this.newTicketFormDescriptionField.fill(descriptionText);
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
    await this.page.waitForTimeout(5000);
  }

  async SaveNewTicket() {
    await this.newTicketFormSaveButton.click();
  }

  async fillNewTicketForm() {
    await this.FillSubjectField();
    await this.SelectProduct();
    await this.SelectTopic();
    await this.SelectUser();
    await this.SelectPriorityOption();
    await this.SelectTypeOption();
    await this.FillDescriptionField();
    await this.UploadFiles();
    await this.SaveNewTicket();
  }
}

module.exports = {
  TicketsPage,
};
