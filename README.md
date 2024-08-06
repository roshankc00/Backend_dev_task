## Requirement

### Backend Requirement

- create user login and signup api
- create a way of adding the user to create the chatGroup and add user using email
- User should be able to chat with user in real time

### language requirement

- Nest js Mongo db
- create react native ui (plus point)

# TechnologyUsed

- Nest js
- MongoDb (Abstract Layer)
- Bull Mq for queuing Email Notifications
- Redis For scaling web socket server with pubsub pubsub model
- EventPattern communication
- Websocket(scalable)

# To Run the App

- setup .env in root dir as in .env.example
- Run npm install
- Run npm run start:dev

# NestJS Application

## Description

This is a NestJS application designed to [brief description of what the application does].

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)
- MongoDB (if using MongoDB as your database)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/roshankc00/Backend_dev_task.git
   cd Backend_dev_task
   ```

2. **Install dependencies:**

   Using npm:

   ```sh
   npm install
   ```

   Using yarn:

   ```sh
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and environment variables as in .env.example:

   ```

   ```

## Running the Application

1. **Development mode:**

   Using npm:

   ```sh
   npm run start:dev
   ```

   Using yarn:

   ```sh
   yarn start:dev
   ```

2. **Production mode:**

   Using npm:

   ```sh
   npm run start:prod
   ```

   Using yarn:

   ```sh
   yarn start:prod
   ```

3. **Watch mode:**

   Using npm:

   ```sh
   npm run start:watch
   ```

   Using yarn:

   ```sh
   yarn start:watch
   ```
