// Credentials
const OWNER = {
  name: 'OWNER',
  user: process.env.OWNER_USER,
  email: process.env.OWNER_EMAIL,
  password: process.env.OWNER_PASSWORD,
};

const STAFF = {
  name: 'STAFF',
  user: process.env.STAFF_USER,
  email: process.env.STAFF_EMAIL,
  password: process.env.STAFF_PASSWORD,
};

const STAFF1 = {
  name: 'STAFF1',
  user: process.env.STAFF1_USER,
  email: process.env.STAFF1_EMAIL,
  password: process.env.STAFF1_PASSWORD,
};

const CONSUMER = {
  name: 'CONSUMER',
  user: process.env.CONSUMER_USER,
  email: process.env.CONSUMER_EMAIL,
  password: process.env.CONSUMER_PASSWORD,
};

module.exports = {
  OWNER,
  STAFF,
  STAFF1,
  CONSUMER,
};
