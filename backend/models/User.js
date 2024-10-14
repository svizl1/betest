const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    twoFactorAuth: {
      secret: String,
      tempSecret: String,
      dataURL: String,
      otpURL: String,
      isEnabled: Boolean,
    },
    account_enabled: {
      type: Boolean,
      default: true,
    },
    account_type: {
      type: String,
      enum: ["merchant", "consumer"],
      default: "consumer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
