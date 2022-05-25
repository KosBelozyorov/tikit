const loginPageConstants = require('./loginPageConstants');
const ticketsPageConstants = require('./ticketsPageConstants');
const newTicketPageConstants = require('./newTicketPageConstants');
const ticketPageConstants = require('./ticketPageConstants');

module.exports = {
  ...loginPageConstants,
  ...ticketsPageConstants,
  ...newTicketPageConstants,
  ...ticketPageConstants,
};
