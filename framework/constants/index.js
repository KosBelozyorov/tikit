const loginPageConstants = require('./loginPageConstants');
const ticketsPageConstants = require('./ticketsPageConstants');
const newTicketPageConstants = require('./newTicketPageConstants');
const ticketPageConstants = require('./ticketPageConstants');
const credentialsConstants = require('./credentialsConstants');

module.exports = {
  ...credentialsConstants,
  ...loginPageConstants,
  ...ticketsPageConstants,
  ...newTicketPageConstants,
  ...ticketPageConstants,
};
