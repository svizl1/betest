// tests/cart.test.js
const request = require("supertest");
const app = require("../server"); // Assuming your Express app is exported from server.js
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const User = require("../models/User");

// Test adding a product to the cart
describe("POST /api/cart", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await Cart.deleteMany({});
    await User.deleteMany({});
  });

  it("should add a product to the cart", async () => {
    // Create a user
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password",
    });
    await user.save();

    // Make a request to add a product to the cart
    const response = await request(app)
      .post("/api/cart")
      .send({ userId: user._id, productId: "product_id", quantity: 2 });

    // Check if the response is successful
    expect(response.status).toBe(200);

    // Check if the product is added to the cart
    const cart = await Cart.findOne({ userId: user._id });
    expect(cart).toBeTruthy();
    expect(cart.products.length).toBe(1);
    expect(cart.products[0].productId).toBe("product_id");
    expect(cart.products[0].quantity).toBe(2);
  });
});
