require('dotenv').config();
const amqp = require('amqplib');
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const RABBITMQ_URL = 'amqp://localhost';

async function consumeFromQueue(queue, processMessage) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        await processMessage(data);
        channel.ack(msg); // Acknowledge the message
      }
    }, { noAck: false });

    console.log(`Listening for messages on ${queue}`);
  } catch (error) {
    console.error('Error consuming from queue:', error);
  }
}

// Process customer data
async function processCustomerData(data) {
  try {
    const customer = new Customer(data);
    await customer.save();
    console.log('Customer saved:', customer);
  } catch (error) {
    console.error('Error saving customer:', error);
  }
}

// Process order data
async function processOrderData(data) {
  try {
    const order = new Order(data);
    await order.save();
    console.log('Order saved:', order);
  } catch (error) {
    console.error('Error saving order:', error);
  }
}

// Start consuming from queues
consumeFromQueue('customer_queue', processCustomerData);
consumeFromQueue('order_queue', processOrderData);
