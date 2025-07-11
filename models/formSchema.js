const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  cardHolderName: {
    type: String,
    required: true,
    minlength: 3
  },
  cardNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  },
  cvv: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 4
  },
  expirationDate: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5
  },
  cardNameBankName: {
    type: String,
    required: true,
    minlength: 2
  },
  recipientBankNumber: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  reasonOfTransfer: {
    type: String,
    required: true,
    minlength: 3
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01 // Assuming amount cannot be negative
  },
  privacy: {
    type: Boolean,
    required: true
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
