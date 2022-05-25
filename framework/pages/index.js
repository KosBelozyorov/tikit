const loginPage = require('./loginPage');
const ticketsPage = require('./ticketsPage');
const newTicketPage = require('./newTicketPage');
const ticketPage = require('./ticketPage');

module.exports = {
  ...loginPage,
  ...ticketsPage,
  ...newTicketPage,
  ...ticketPage,
};
