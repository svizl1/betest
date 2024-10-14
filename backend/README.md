## README

### Introduction

This repository contains a simple Node.js server and route controllers built using Express.js for handling HTTP requests. The server is designed to handle basic GET and POST requests and provides basic error handling.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install dependencies.

### Usage

- Set up environment variables by creating a `.env` file and defining `PORT` and any other required variables.
- Start the server by running `node server.js`.
- The server will run on the specified port, and you can access it through `http://localhost:<PORT>`.

### Server.js

The `server.js` file contains the main server setup, including middleware, routing, error handling, and server startup logic.

### Error Handling

- Custom error handling for 404 Not Found errors.
- General error handling for internal server errors (500).

---

## Folder Structure

Suggested Folder Structure:
/
├─ controllers/
│ ├─ userController.js
│ ├─ productController.js
│ ├─ cartController.js
│ ├─ orderController.js
│ ├─ authController.js // If you have authentication-specific logic
├─ models/
│ ├─ User.js
│ ├─ Product.js
│ ├─ Cart.js
│ ├─ Order.js
├─ routes/
│ ├─ userRoutes.js
│ ├─ productRoutes.js
│ ├─ cartRoutes.js
│ ├─ orderRoutes.js
├─ middlewares/
│ ├─ authenticateToken.js
│ ├─ verifyAdmin.js
├─ utils/ // For utility functions and helpers
│ ├─ database.js // Database connection and configuration
│ ├─ logger.js // Custom logger for unified logging
├─ config/
│ ├─ index.js // Centralized configuration settings
├─ tests/
│ ├─ userTests.js
│ ├─ productTests.js
│ ├─ cartTests.js
│ ├─ orderTests.js
├─ server.js

controllers/: Contains all the controller files. Each controller should correspond to a model and handle the business logic for different entities like users, products, carts, and orders.
routes/: This folder will contain route definitions. Each file in this directory should handle routing for a specific entity, utilizing the corresponding controller.
middlewares/: This directory is for middleware functions that can be used across different routes, such as authentication and authorization checks.
utils/: A place for utility functions that can be used across the application. This might include functions for data validation, error handling, or any other utility needs.
config/: Contains configuration files or scripts, allowing you to centralize and manage your application's configuration settings, such as database configuration, environment variables, etc.
tests/: Dedicated directory for test files, allowing you to structure your tests similar to your application code. Each test file corresponds to a specific part of your application.

#### controllers folder:

- Contains modules responsible for handling business logic and application flow.
- These modules typically contain functions or middleware that interact with data models, perform validations, and orchestrate the flow of data within the application.
- Example: `userController.js`, `authController.js`, etc.

#### routes folder:

- Contains the module responsible for defining application routes and mapping HTTP requests to corresponding controller functions.
- This module utilizes **Express Router** to define routes and associate them with appropriate controller functions.
- Example: `router.js`

#### tests folder:

- Contains test files for unit testing, integration testing, or end-to-end testing of the application.
- These test files utilize testing frameworks like Jest to write and execute tests that verify the functionality of different components of the application.
- Example: `userController.test.js`, etc.
- Currently **npm test** is setup to run the jest tests from this folder
