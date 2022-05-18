// URLs
const COWORK_URL = 'https://test-kb.coworkplace.us/';

// Credentials
const STAFF_CREDENTIALS = {
  email: process.env.STAFF_EMAIL,
  password: process.env.STAFF_PASSWORD,
};

// Selectors
const LOGIN_FORM_EMAIL = 'form#doSignIn input[type="email"]';
const LOGIN_FORM_PASSWORD = 'form#doSignIn input[type="password"]';
const LOGIN_FORM_BUTTON = 'form#doSignIn button[type="submit"]';

console.log('test');

module.exports = {
  COWORK_URL,
  STAFF_CREDENTIALS,
  LOGIN_FORM_EMAIL,
  LOGIN_FORM_PASSWORD,
  LOGIN_FORM_BUTTON,
};
