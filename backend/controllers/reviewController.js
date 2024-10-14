// controllers/reviewController.js
const Review = require("../models/Review");

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    const newReview = new Review({ productId, userId, rating, comment });
    await newReview.save();
    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews for product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews submitted by a specific user
exports.getReviewsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await Review.find({ userId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting user reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};
