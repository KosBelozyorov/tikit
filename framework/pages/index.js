const loginPage = require('./loginPage');
const ticketsPage = require('./ticketsPage');

module.exports = {
  ...loginPage,
  ...ticketsPage,
};
