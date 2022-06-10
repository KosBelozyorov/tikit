// URLs
const COWORK_URL = 'https://test-kb.coworkplace.us/';

// Credentials
const OWNER = {
  name: 'OWNER',
  user: 'Kostya Belozyorov',
  email: process.env.OWNER_EMAIL,
  password: process.env.OWNER_PASSWORD,
};

const STAFF = {
  name: 'STAFF',
  user: 'Test Testeroff',
  email: process.env.STAFF_EMAIL,
  password: process.env.STAFF_PASSWORD,
};

const CONSUMER = {
  name: 'CONSUMER',
  user: 'User Consumer',
  email: process.env.CONSUMER_EMAIL,
  password: process.env.CONSUMER_PASSWORD,
};

// Selectors
const LOGIN_FORM_EMAIL = 'form#doSignIn input[type="email"]';
const LOGIN_FORM_PASSWORD = 'form#doSignIn input[type="password"]';
const LOGIN_FORM_BUTTON = 'form#doSignIn button[type="submit"]';
const SIDEBAR_PROFILE_OPEN_BUTTON =
  '.sidebar .profile-nav.sidebar-opener__profile';
const SIDEBAR_SIGNOUT_BUTTON = '.sign-out button.btn.btn-primary-icon';

module.exports = {
  COWORK_URL,
  OWNER,
  STAFF,
  CONSUMER,
  LOGIN_FORM_EMAIL,
  LOGIN_FORM_PASSWORD,
  LOGIN_FORM_BUTTON,
  SIDEBAR_PROFILE_OPEN_BUTTON,
  SIDEBAR_SIGNOUT_BUTTON,
};
