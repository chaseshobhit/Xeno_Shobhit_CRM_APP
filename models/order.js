const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderDate: { type: Date, default: Date.now },
  items: [{ itemName: String, quantity: Number, price: Number }],
  totalAmount: { type: Number, required: true }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
