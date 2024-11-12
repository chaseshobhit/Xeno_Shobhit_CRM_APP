# Mini CRM & Campaign Management App with Pub-Sub Architecture

This project is a simple CRM (Customer Relationship Management) system that handles customer and order data. The system uses a **Pub-Sub (Publisher-Subscriber)** model with **RabbitMQ** to asynchronously process and store customer and order data in **MongoDB**. Docker is used to containerize the application.

## **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Technologies Used](#technologies-used)
5. [Setup and Installation](#setup-and-installation)
6. [API Endpoints](#api-endpoints)
7. [Pub-Sub Architecture](#pub-sub-architecture)
8. [Docker Setup](#docker-setup)
9. [Testing the Application](#testing-the-application)
10. [Additional Notes](#additional-notes)

---

## **Overview**

This project provides a simplified **CRM (Customer Relationship Management)** system where you can add customers, manage their orders, and use a **Publisher-Subscriber** pattern to process customer and order data asynchronously using **RabbitMQ**.

### **What Is a Pub-Sub Model?**

In a Pub-Sub model:

- **Publisher** sends messages (data) to a message broker (RabbitMQ).
- **Subscriber** listens to the broker for new messages and processes them.

In this application, the publisher publishes customer and order data, and the consumer subscribes to the queue and saves the data into MongoDB.

---

## **Features**

1. **Customer Management:**

   - Create, update, and delete customer information.
   - View details of all customers.

2. **Order Management:**

   - Create, update, and delete orders for customers.
   - View order details.

3. **Asynchronous Data Processing:**

   - Customer and order data are published to RabbitMQ queues.
   - The consumer listens to the queues and processes the data (inserts it into MongoDB).

4. **Docker & RabbitMQ:**
   - The application is containerized using Docker for easy setup.
   - RabbitMQ is used as the message broker to handle Pub-Sub communication.

---

## **System Architecture**

The system is composed of the following components:

1. **Publisher**: Accepts HTTP requests (e.g., `/customers`, `/orders`) and publishes the data to RabbitMQ queues (`customer_queue`, `order_queue`).
2. **RabbitMQ**: Message broker that holds the data until the consumer processes it.
3. **Consumer**: Listens to the RabbitMQ queues, processes the data, and saves it to MongoDB.

---

## **Technologies Used**

- **Node.js**: Backend JavaScript runtime environment.
- **Express.js**: Web framework for building the RESTful API.
- **MongoDB**: NoSQL database to store customer and order data.
- **RabbitMQ**: Message broker to implement the Pub-Sub model.
- **Docker**: Containerization platform for packaging and running the application.
- **AMQPLib**: Node.js library to connect to RabbitMQ.

---

## **Setup and Installation**

### Step 1: Clone the repository

```bash
git clone https://github.com/your-repo/mini-crm.git
cd mini-crm
```

### Step 2: Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### Step 3: Setup MongoDB Atlas

1. Create a MongoDB account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and get the connection string.
3. Create a `.env` file in the project root and add the MongoDB connection string:

```bash
MONGO_URI=your-mongodb-uri
```

### Step 4: Setup RabbitMQ

1. Install **RabbitMQ** locally or use a service like [CloudAMQP](https://www.cloudamqp.com/).
2. If using locally, ensure RabbitMQ is running on `localhost:5672`.

### Step 5: Running the Application

1. To run the application directly (without Docker):

   ```bash
   node server.js
   ```

2. Alternatively, to run with Docker, use the following commands:
   - Build the Docker image:
     ```bash
     docker build -t mini-crm .
     ```
   - Run the Docker container:
     ```bash
     docker run -p 5000:5000 mini-crm
     ```

### Step 6: Verify RabbitMQ and MongoDB

- RabbitMQ: Access the RabbitMQ management interface at `http://localhost:15672/` (default credentials: `guest`/`guest`).
- MongoDB: Check the data in MongoDB using MongoDB Compass or MongoDB CLI.

---

## **API Endpoints**

### Customer Routes

1. **POST /customers**: Create a new customer.
2. **GET /customers**: Get a list of all customers.
3. **GET /customers/:id**: Get a specific customer by ID.
4. **PUT /customers/:id**: Update a customer by ID.
5. **DELETE /customers/:id**: Delete a customer by ID.

### Order Routes

1. **POST /orders**: Create a new order (link to a customer).
2. **GET /orders**: Get a list of all orders.
3. **GET /orders/:id**: Get a specific order by ID.
4. **PUT /orders/:id**: Update an order by ID.
5. **DELETE /orders/:id**: Delete an order by ID.

---

## **Pub-Sub Architecture**

1. **Publisher (publisher.js)**:

   - Receives data (e.g., customer or order) via HTTP `POST` requests.
   - Publishes this data to RabbitMQ queues (e.g., `customer_queue`, `order_queue`).

   Example of publishing data to a queue:

   ```javascript
   async function publishToQueue(queue, message) {
     const connection = await amqp.connect("amqp://localhost");
     const channel = await connection.createChannel();
     await channel.assertQueue(queue, { durable: true });
     channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
       persistent: true,
     });
     console.log(`Message sent to queue ${queue}`);
   }
   ```

2. **Consumer (consumer.js)**:

   - Listens to the queues for new messages.
   - Processes the data and inserts it into MongoDB.

   Example of consuming data from a queue:

   ```javascript
   async function consumeFromQueue(queue, processMessage) {
     const connection = await amqp.connect("amqp://localhost");
     const channel = await connection.createChannel();
     await channel.assertQueue(queue, { durable: true });
     channel.consume(queue, async (msg) => {
       if (msg !== null) {
         const data = JSON.parse(msg.content.toString());
         await processMessage(data);
         channel.ack(msg); // Acknowledge the message
       }
     });
   }
   ```

---

## **Docker Setup**

1. **Dockerfile**: The project is containerized with Docker to make it easy to run and deploy.
2. **Build Docker Image**:
   Run the following command to build the Docker image:

   ```bash
   docker build -t mini-crm .
   ```

3. **Run the Docker Container**:
   Run the container with the following command:
   ```bash
   docker run -p 5000:5000 mini-crm
   ```

---

## **Testing the Application**

### Step 1: Use Postman to Test APIs

1. **Creating a Customer**:

   - Open Postman.
   - Send a `POST` request to `http://localhost:5000/customers` with the customer data:

   ```json
   {
     "name": "Jane Doe",
     "email": "jane.doe@example.com",
     "phone": "+9876543210"
   }
   ```

2. **Creating an Order**:
   - Send a `POST` request to `http://localhost:5000/orders` with the order data:
   ```json
   {
     "customerId": "123456789",
     "items": [{ "product": "Laptop", "quantity": 1, "price": 1000 }],
     "totalAmount": 1000
   }
   ```

### Step 2: Verify Data in MongoDB

- After sending requests through Postman, check if the data appears in MongoDB (either using MongoDB Compass or MongoDB CLI).

### Step 3: Verify RabbitMQ

- Open the RabbitMQ management interface and check the queues (`customer_queue` and `order_queue`) to see if the messages are being sent to the queue and then processed.

---

## **Additional Notes**

- **Error Handling**: Ensure proper error handling in all parts of the application (especially in the consumer service) to handle any issues that may arise during message processing.
- **Scalability**: This system can scale by running multiple consumers to process data concurrently from RabbitMQ queues.

---

This is the complete setup for a Mini CRM with Pub-Sub architecture, including Docker, RabbitMQ, and MongoDB. By following the steps above, you should be able to get the system up and running. Happy coding!

---

This README file provides an easy-to-follow guide for setting up, running, and testing the application, and should help any developer understand how to
