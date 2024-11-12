# Mini CRM & Campaign Management App with Pub-Sub Architecture

This project is a simple CRM system that allows you to manage customers and orders, with asynchronous data processing using RabbitMQ. The app follows a **Pub-Sub (Publisher-Subscriber)** model where data is sent to RabbitMQ queues and processed by a consumer.

## What I Did

1. **API Development**:
   - Created a server and developed all necessary APIs for managing customers and orders with proper validations.
   
2. **Models**:

   - Designed two models: `customer.js` and `order.js`, and connected them to MongoDB using Mongoose. The data is stored in a MongoDB cluster hosted on MongoDB Atlas.

3. **Pub-Sub Model**:

   - Implemented the Pub-Sub architecture using RabbitMQ for asynchronous data processing.
   - Installed Docker and RabbitMQ along with other necessary packages to facilitate message queuing.

4. **Publisher & Consumer**:

   - Initially, I set up the publisher and consumer to run on separate servers using different ports, making it scalable and efficient.
   - For simplicity and integration, I merged the publisher code into the main `server.js` file and got both publisher and server running on the same port.

5. **Testing**:

   - Tested all API endpoints using Postman.
   - Verified that messages were correctly sent to RabbitMQ and processed by the consumer.

6. **Deployment**:
   - Pushed the final project to GitHub, ensuring the code is ready for deployment.

## Features

- **Customer Management**: Add, update, view, and delete customers.
- **Order Management**: Create, update, view, and delete orders.
- **Pub-Sub Model**: Customer and order data are published to RabbitMQ queues and processed asynchronously by a consumer.
- **MongoDB Integration**: Data is stored in MongoDB Atlas.
- **Docker Support**: The app is containerized using Docker for easy setup.

## Technologies Used

- **Node.js**: Backend JavaScript runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB (Atlas)**: Cloud-based database to store data.
- **RabbitMQ**: Message broker to implement Pub-Sub architecture.
- **Docker**: Containerization platform to simplify deployment.

## API Endpoints

### Customer Routes

- **POST /customers**: Create a new customer.
- **GET /customers**: Get all customers.
- **GET /customers/:id**: Get a specific customer by ID.
- **PUT /customers/:id**: Update customer details.
- **DELETE /customers/:id**: Delete a customer by ID.

### Order Routes

- **POST /orders**: Create a new order linked to a customer.
- **GET /orders**: Get all orders.
- **GET /orders/:id**: Get a specific order by ID.
- **PUT /orders/:id**: Update an order.
- **DELETE /orders/:id**: Delete an order.

## Testing the Application

- Use **Postman** to test the API endpoints.
- After sending requests, you can verify the data in **MongoDB** (via MongoDB Compass or MongoDB CLI).
- Check **RabbitMQ** for messages in the `customer_queue` and `order_queue`.

## Conclusion

This project was an exciting opportunity to learn and implement the Pub-Sub architecture using RabbitMQ, combined with MongoDB for data storage. The system is designed to handle asynchronous processing of customer and order data, ensuring scalability and efficiency. The entire application is containerized using Docker for easy deployment.
