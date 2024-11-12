require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const RABBITMQ_URL = 'amqp://localhost';

app.use(bodyParser.json());

async function publishToQueue(queue, message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to queue ${queue}`);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing to queue:', error);
  }
}

// POST /customers
app.post('/customers', async (req, res) => {
  try {
    const customerData = req.body;
    await publishToQueue('customer_queue', customerData);
    res.status(202).json({ message: 'Customer data published to queue' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /orders
app.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    await publishToQueue('order_queue', orderData);
    res.status(202).json({ message: 'Order data published to queue' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Publisher server running on port ${PORT}`);
});
