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
- Redis For scaling web socket server with pubsub model
- EventEmitters
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

- Node.js (>= 17.x)
- npm (>= 10.x) or pnpm (>= 8.x)
- MongoDB

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

   Using pnpm:

   ```sh
   pnpm install
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

   Using pnpm:

   ```sh
   pnpm start:dev
   ```

2. **Production mode:**

   Using npm:

   ```sh
   npm run start:prod
   ```

   Using pnpm:

   ```sh
   pnpm start:prod
   ```

3. **Watch mode:**

   Using npm:

   ```sh
   npm run start:watch
   ```

   Using pnpm:

   ```sh
   pnpm start:watch
   ```
