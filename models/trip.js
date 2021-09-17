const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  trip_no: {
    type: Number,
    required: true,
  },
  train_no: {
    type: Number,
    required: true,
  },
	train_img	: {
    type: String,
    required: true,
  },
	price: {
    type: Number,
    required: true,
  },
	trip_time: {
    type: String,
    required: true,
  },
	train_type: {
    type: String,
    required: true,
  },
	from: {
    type: String,
    required: true,
  },
	to: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;