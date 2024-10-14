const Cart = require("../models/Cart");
const Product = require("../models/Product"); // Ensure you have access to the Product model

// Add a product to the cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Fetch the product to check stock levels
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is available in stock
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} units available in stock. Please adjust your quantity.`,
      });
    }

    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist for the user, create a new one
    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      // If product already exists in the cart, update its quantity
      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        const newQuantity = cart.products[existingProductIndex].quantity + quantity;
        
        // Ensure updated quantity does not exceed available stock
        if (product.stock < newQuantity) {
          return res.status(400).json({
            message: `Only ${product.stock} units available in stock. Adjust the quantity in your cart.`,
          });
        }

        cart.products[existingProductIndex].quantity = newQuantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.products.push({ productId, quantity });
      }
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get the cart contents for a user
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "title price"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update the quantity of a product in the cart
exports.updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (item) => item.productId === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};