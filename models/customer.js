const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
