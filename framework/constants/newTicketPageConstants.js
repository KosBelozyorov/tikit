// Selectors
const NEW_TICKET_FORM_CONTACT_FIELD =
  'form#createTicket div:nth-of-type(1) .select2-wrap .select2-selection__rendered';
const NEW_TICKET_FORM_CONTACT_SEARCH_FIELD =
  '.select2-search.select2-search--dropdown .select2-search__field';
const NEW_TICKET_FORM_SUBJECT_FIELD =
  'form#createTicket input.input-field[name="title"]';
const NEW_TICKET_FORM_PRODUCT_FIELD =
  'form#createTicket>div:nth-of-type(3) span.select2-selection';
const NEW_TICKET_FORM_SEARCH_PRODUCT_FIELD =
  'form#createTicket>div:nth-of-type(3) .select2-search__field';
const NEW_TICKET_FORM_TOPIC_FIELD =
  'form#createTicket>div:nth-of-type(3) span.select2-selection';
const NEW_TICKET_FORM_SEARCH_TOPIC_FIELD =
  'form#createTicket>div:nth-of-type(3) .select2-search__field';
const NEW_TICKET_FORM_ASSIGNED_FIELD =
  'form#createTicket>div:nth-of-type(4) span.select2-selection';
const NEW_TICKET_FORM_SEARCH_ASSIGNED_FIELD =
  'form#createTicket>div:nth-of-type(4) .select2-search__field';
const NEW_TICKET_FORM_PRIORITY_FIELD =
  'text=Urgent High Medium Low Medium >> span[role="presentation"]';
const NEW_TICKET_FORM_TYPE_FIELD =
  'text=Task Feature Incident Problem Question Question >> span[role="textbox"]';
const NEW_TICKET_FORM_FIELD_OPTIONS =
  'ul.select2-results__options li.select2-results__option';
const NEW_TICKET_FORM_DESCRIPTION_FIELD = '.input-editor .ck-editor__editable';
const NEW_TICKET_FORM_FILES_UPLOAD = '.input-file__holder input[type="file"]';
const NEW_TICKET_FORM_SAVE_BUTTON =
  'form#createTicket>div:nth-of-type(9)>button';

module.exports = {
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
};
