const { expect } = require('@playwright/test');
const uid = require('uid2/promises');

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
  CONSUMER,
  OWNER,
  STAFF,
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

  // TODO: Need to move this function to the Lib
  async getRandomValue(elemLocator, modifier = 0) {
    const elementsAmount = await this.getElementsAmount(elemLocator, modifier);
    const x = Math.floor(Math.random() * elementsAmount + 1);

    return x;
  }

  async getContactName() {
    const fullContactNameField =
      await this.newTicketFormContactField.textContent();
    const contactName = fullContactNameField.split(' - ')[0];

    this.ticket.author = contactName;

    return contactName;
  }

  async getCustomContactName() {
    const fullContactNameField =
      await this.newTicketFormContactField.textContent();
    const contactName = fullContactNameField.split(' - ')[0];
    const contactEmail = fullContactNameField.split(' - ')[1];

    this.ticket.author = contactName;
    this.ticket.email = contactEmail;

    return contactName;
  }

  async setContactName(customName) {
    this.ticket.user = customName;

    return this.ticket.user;
  }

  async setAuthor(role) {
    this.ticket.author = role.user;
    this.ticket.email = role.email;
  }

  async setContactEmail(customEmail) {
    this.ticket.email = customEmail;

    return this.ticket.email;
  }

  async setOwnerName(customName) {
    this.ticket.ownerName = customName;

    return this.ticket.ownerName;
  }

  async setOwnerEmail(customEmail) {
    this.ticket.ownerEmail = customEmail;

    return this.ticket.ownerEmail;
  }

  async setStaffName(customName) {
    this.ticket.staffName = customName;

    return this.ticket.staffName;
  }

  async setStaffEmail(customEmail) {
    this.ticket.staffEmail = customEmail;

    return this.ticket.staffEmail;
  }

  async ReadConsumerContacts(role) {
    this.ticket.name = role.user;
    this.ticket.email = role.email;
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
    await fieldLocator.type(option); // add { delay: 20 } to slow type

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
    const optionSelectorFromSearchList = `li[role="option"]`;
    const optionNameFromSearchList = this.page
      .locator(optionSelectorFromSearchList)
      .filter({ hasText: customOptionName })
      .first();

    await expect(optionNameFromSearchList).toContainText(optionName);
    await optionNameFromSearchList.click();

    return optionName;
  }

  async ReadContactField() {
    await this.getContactName();
  }

  // eslint-disable-next-line class-methods-use-this
  async getUniqTicketId() {
    const uniqId = await uid(10);

    return uniqId;
  }

  async FillCustomContactField(name) {
    this.newTicketFormContactField.click();
    await this.selectCustomOption(this.newTicketFormContactSearchField, name);

    await this.getCustomContactName();
  }

  async FillSubjectField() {
    const id = await this.getUniqTicketId();
    const subjectText = `TEST! New ticket ${id} ${Date()}`;
    await this.newTicketFormSubjectField.click();
    await this.newTicketFormSubjectField.fill(subjectText);

    this.ticket.uid = id;
    this.ticket.subject = subjectText;
  }

  async SelectRandomProduct() {
    await this.newTicketFormProductField.click();
    await this.newTicketFormSearchProductField.click();
    this.ticket.product = await this.selectRandomOption(
      this.newTicketFormSearchProductField,
      this.newTicketFormOptions,
      1,
    );
  }

  async SelectCustomProduct(customProduct) {
    await this.newTicketFormProductField.click();
    await this.newTicketFormSearchProductField.click();
    this.ticket.product = await this.selectCustomOption(
      this.newTicketFormSearchProductField,
      customProduct,
    );

    if (this.ticket.product === '--') {
      this.ticket.product = '';
    }
  }

  async SelectTopic() {
    await this.page.waitForTimeout(2000);
    await this.newTicketFormTopicField.click();
    await this.newTicketFormSearchPTopicField.click();
    await (this.ticket.topic = await this.selectRandomOption(
      this.newTicketFormSearchPTopicField,
      this.newTicketFormOptions,
      1,
    ));
  }

  async SelectCustomTopic(customTopic) {
    await Promise.all([
      await this.newTicketFormTopicField.click(),
      await this.newTicketFormSearchPTopicField.click(),
      await (this.ticket.topic = await this.selectCustomOption(
        this.newTicketFormSearchPTopicField,
        customTopic,
      )),
    ]);
  }

  async SelectRandomUser() {
    await this.newTicketFormAssignedField.click();
    await this.newTicketFormSearchAssignedField.click();
    this.ticket.name = await this.selectRandomOption(
      this.newTicketFormSearchAssignedField,
      this.newTicketFormOptions,
      1,
    );
  }

  async SelectCustomUser(user) {
    await this.newTicketFormAssignedField.click();
    await this.newTicketFormSearchAssignedField.click();
    this.ticket.name = await this.selectCustomOption(
      this.newTicketFormSearchAssignedField,
      user,
    );
  }

  async SelectRandomPriorityOption() {
    await this.newTicketFormPriorityField.click();
    const elementId = this.getRandomValue(this.newTicketFormOptions);
    const elementLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await elementId})`;

    this.ticket.priority = await this.page
      .locator(elementLocator)
      .textContent();

    await this.page.locator(elementLocator).click();
  }

  async SelectRandomTypeOption() {
    await this.newTicketFormTypeField.click();
    const elementId = this.getRandomValue(this.newTicketFormOptions);
    const elementLocator = `${NEW_TICKET_FORM_FIELD_OPTIONS}:nth-child(${await elementId})`;

    this.ticket.type = await this.page.locator(elementLocator).textContent();

    await this.page.locator(elementLocator).click();
  }

  async FillDescriptionField() {
    await this.newTicketFormDescriptionField.click();
    const descriptionText =
      'TEST TICKET Lorem, ipsum dolor sit amet consectetur adipisicing elit. A itaque quisquam optio laboriosam illo? Impedit sed numquam eos optio saepe aut laudantium dolorem voluptatem minus, ducimus animi voluptate magni voluptatum odit quisquam enim earum reiciendis officia similique vitae quibusdam? Molestias rem itaque laboriosam architecto labore voluptas atque, tempora magni eum?';

    await this.newTicketFormDescriptionField.fill(descriptionText);

    this.ticket.description = descriptionText;
  }

  async UploadFiles(amount = 3) {
    const filesForUpload = [
      '../../../FilesToUpload/man.png',
      '../../../FilesToUpload/CycleStreetsMobileAppSpecification.pdf',
      '../../../FilesToUpload/test.txt',
      '../../../FilesToUpload/test-data-file.xlsx',
    ];

    const modifier = filesForUpload.length - amount;

    const filesToUpload = [];

    for (let i = 0; i < filesForUpload.length - modifier; i += 1) {
      filesToUpload.push(filesForUpload[i]);
    }

    // eslint-disable-next-line no-console
    console.log('files to upload: ', filesToUpload);

    // await Promise.all([
    //   await this.newTicketFormFilesUpload.setInputFiles(filesToUpload, {
    //     timeout: 3000,
    //   }),
    //   await this.page.waitForTimeout(6000),
    // ]);

    await this.newTicketFormFilesUpload.setInputFiles(filesToUpload, {
      timeout: 3000,
    });

    const attachmentsList = filesToUpload.map(item =>
      item.replace('../../../FilesToUpload/', ''),
    );

    this.ticket.attachments = attachmentsList;
  }

  async SaveNewTicket() {
    await Promise.all([
      await this.newTicketFormSaveButton.click(),
      await this.page.waitForTimeout(85),
      // await this.page.goto('https://test-kb.coworkplace.us/tickets'),
      await this.page.waitForNavigation(/* 'https://test-kb.coworkplace.us/tickets' */),
    ]);

    return this.ticket;
  }

  async fillNewTicketForm(role) {
    switch (role.name) {
      case 'OWNER':
        await this.fillNewTicketFormAsOwner();
        break;

      case 'STAFF':
        await this.fillNewTicketFormAsStaff();
        break;

      case 'CONSUMER':
        await this.fillNewTicketFormAsConsumer(role);
        break;

      default:
        // eslint-disable-next-line no-console
        console.log('Invalid role name');
    }
  }

  async fillNewTicketFormAsOwner() {
    await this.setAuthor(OWNER);
    await this.FillSubjectField();
    await this.SelectRandomProduct();
    await this.SelectTopic();
    await this.SelectRandomUser();
    await this.SelectRandomPriorityOption();
    await this.SelectRandomTypeOption();
    await this.FillDescriptionField();
    await this.UploadFiles(1);
  }

  async fillNewTicketFormAsStaff() {
    await this.setAuthor(STAFF);
    await this.FillSubjectField();
    await this.SelectRandomProduct();
    await this.SelectTopic();
    await this.SelectRandomUser();
    await this.SelectRandomPriorityOption();
    await this.SelectRandomTypeOption();
    await this.FillDescriptionField();
    await this.UploadFiles(1);
  }

  async fillNewTicketFormAsConsumer() {
    await this.setAuthor(CONSUMER);
    await this.FillSubjectField();
    await this.SelectRandomProduct();
    await this.SelectTopic();
    await this.SelectRandomPriorityOption();
    await this.SelectRandomTypeOption();
    await this.FillDescriptionField();
    await this.UploadFiles(1);
  }

  async fillNewTicketFormAsOwnerBehalfStaff() {
    await this.FillCustomContactField('Test Testeroff');
    await this.FillSubjectField();
    await this.SelectCustomProduct('test product2');
    await this.SelectCustomUser('None');
    await this.SelectRandomPriorityOption();
    await this.SelectRandomTypeOption();
    await this.FillDescriptionField();
    await this.UploadFiles();
  }
}

module.exports = {
  NewTicketPage,
};
