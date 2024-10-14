// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema(
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
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cart", CartSchema);

// models/Cart.js
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Reference to the user who owns this cart
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to the product
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
