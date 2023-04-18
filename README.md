# My IoT Backend Project

This is an IoT backend project built with NestJS that provides a RESTful API for managing users and IoT devices (sensors). It demonstrates a well-structured architecture with separate layers for application logic, domain, and infrastructure.

## Features

- User authentication and authorization using JSON Web Tokens (JWT).
- Role-based access control for different user types (admin, user).
- Management of IoT devices (sensors) with CRUD operations.
- Sensor access control using a custom interceptor.
- Integration with AWS DynamoDB for data storage.
- Integration with AWS IoT services for device management.
- Real-time communication with sensors using MQTT protocol.
- Scheduled storage of average sensor data every 5 minutes.

## Getting Started

### Prerequisites

To run this project locally, you'll need to have the following installed:

- Node.js (version 12 or higher)
- Yarn (optional, but recommended)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/jcarranzav1/my-iot-backend.git
   ```

2. Install the dependencies:

   ```sh
   cd my-iot-backend
   yarn install

   ```

3. Set up environment variables:

   Copy the .env.example file to a new .env file and fill in the required environment variables for your AWS account, JWT secret, and other configurations.

   ```sh
   cp .env.example .env
   ```

4. Run the project:

   ```sh
   yarn start
   ```

   The API will be available at http://localhost:3000.

## Documentación de API

You can access the API documentation at http://localhost:3000/api-docs. The documentation is generated using the NestJS Swagger module and provides an interactive interface for exploring the available API endpoints and testing the requests.

## Deployment

You can deploy this backend to any platform that supports Node.js applications, such as AWS Elastic Beanstalk, Heroku, or Vercel. Just make sure to set the appropriate environment variables and configure the necessary services (e.g., DynamoDB, AWS IoT, and MQTT broker) in your chosen platform

## License

This project is licensed under the MIT License - see the LICENSE file for details.
