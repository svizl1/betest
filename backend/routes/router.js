const express = require("express");
const routeController = require("../controllers/basicRouteController");
const {
  createUser,
  loginUser,
  verify2FAToken,
} = require("../controllers/userController");

const authenticateToken = require("../middlewares/authenticateToken");
const isAdmin = require("../middlewares/isAdmin");

const listUsers = require("../controllers/adminListUsers");
const toggleStatus = require("../controllers/adminToggleAccStatus");
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const reviewController = require("../controllers/reviewController");
const submitContactForm = require("../controllers/contactController");

const { updateUserProfile } = require("../controllers/userController");
//const { getAllProducts } = require("../controllers/productController");
const router = express.Router();

router.get("/", routeController.default); // Server is running
router.get("/api/", routeController.get); //Test Route
router.post("/api/", routeController.post); //Test Route
router.post("/api/users", createUser); // Account Creation API

// Profile Update Route
router.put("/api/users/profile", authenticateToken, updateUserProfile);

router.post("/api/login", loginUser); //Login users

//**************************** admin stuff *******************************
router.get("/api/admin/listUsers", authenticateToken, isAdmin, listUsers);
router.post("/api/admin/toggleUser", authenticateToken, isAdmin, toggleStatus);

router.post("/api/contact", submitContactForm);
//************************************************************************

// Product routes
router.use("/api/products", productController); // Use product controller for product routes
// Get Products with Pagination, Search, and Filter
// router.get("/api/products", getAllProducts);

//router.post('/enable-2fa', authenticateToken, enable2FA); //Note to tianchen: enable 2FA does not exist in userController, why are you referencing this?
router.post("/verify-2fa", authenticateToken, verify2FAToken);

// Add a product to the cart
router.post("/api/cart", authenticateToken, cartController.addToCart);

// Get the cart contents for a user
router.get("/api/cart/:userId", authenticateToken, cartController.getCart);

// Update the quantity of a product in the cart
router.put("/api/cart", authenticateToken, cartController.updateQuantity);

// Place a new order
router.post("/api/orders", authenticateToken, orderController.placeOrder);

// Get order history for a user
router.get(
  "/api/orders/:userId",
  authenticateToken,
  orderController.getOrderHistory
);

// Update the status of an order
router.put(
  "/api/orders/:orderId",
  authenticateToken,
  orderController.updateOrderStatus
);

// Endpoint to add a new review
router.post("/", reviewController.addReview);

// Endpoint to get reviews for a specific product
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Endpoint to get reviews submitted by a specific user
router.get("/user/:userId", reviewController.getReviewsByUser);

module.exports = router;
