require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Customer = require('./models/Customer');
const Order = require('./models/Order');

const app = express();

const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Customer Routes

// Get all customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a specific customer by ID
app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update customer details
app.put('/customers/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a customer by ID
app.delete('/customers/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Order Routes

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a specific order by ID
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an order
app.put('/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an order
app.delete('/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
