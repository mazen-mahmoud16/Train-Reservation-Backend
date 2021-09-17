const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  seat_no: {
    type: Number,
    required: true,
  },
	cart_number	: {
    type: Number,
    required: true,
  },
	startDate: {
    type: String,
    required: true,
  },
	returnDate: {
    type: String,
    required: false,
  },
	noOfTickets: {
    type: Number,
    required: true,
  },
	trip_no_start: {
    type: Number,
    required: true,
  },
	trip_no_return: {
    type: Number,
    required: false,
  },
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;