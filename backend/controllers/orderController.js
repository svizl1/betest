const Order = require("../models/Order");
const Product = require("../models/Product"); // Ensure you have access to the Product model

// Place a new order
exports.placeOrder = async (req, res) => {
  const { userId, products, amount, address } = req.body;

  try {
    // Check stock availability for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Check if the product has enough stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Only ${product.stock} units available.`,
        });
      }
    }

    // Adjust stock for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Create a new order
    const newOrder = new Order({ userId, products, amount, address });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get order history for a user
exports.getOrderHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting order history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};