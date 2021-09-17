const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    name_card: {
      type: String,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
    },
    card_number: {
      type: String,
      required: true,
    },
    expiration_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
