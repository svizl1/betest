//Testing Variables
const enableLogging = true; // change to true get terminal outputs

//Setup & Imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const routes = require("./routes/router");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Mongo Connection

const uri = "mongodb+srv://capstone:5ai6KcG6Jll9EXA4@capstone-ecommerce.x4jcmxk.mongodb.net/?retryWrites=true&w=majority&appName=Capstone-Ecommerce";


mongoose
  .connect(uri, {})
  .then(() => {
    if (enableLogging) {
      console.log("MongoDB connected successfully");
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Terminal Logging Functionality
app.use((req, res, next) => {
  if (enableLogging) {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Uses the router exported from router.js
app.use("/", routes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "404: Resource not found" }); // Custom response for 404 errors
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "500: Internal server error" });
});

app.listen(PORT, () => {
  if (enableLogging) {
    console.log(`Server is running on port ${PORT}`);
  }
});

//module.exports = { app, server };
