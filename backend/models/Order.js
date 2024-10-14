// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user who placed the order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Reference to the product
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true }, // Total amount of the order
    address: { type: String, required: true }, // Shipping address
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    }, // Order status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true },
//     products: [
//       {
//         productId: {
//           type: String,
//         },
//         quantity: {
//           type: Number,
//           default: 1,
//         },
//       },
//     ],
//     amount: { type: Number, required: true },
//     address: { type: Object, required: true },
//     status: { type: String, default: "pending" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);
