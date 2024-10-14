const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

// CREATE a new product (Admin only)
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE a product (Admin only)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a product (Admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single product by id (Everyone)
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET all products (Everyone) Formal Get
// router.get("/", async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   try {
//     let products;

//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(5);
//     } else if (qCategory) {
//       products = await Product.find({ categories: { $in: [qCategory] } });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Get All Products with Pagination, Search, and Filter
//async function getAllProducts(req, res) {
router.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
  } = req.query;

  try {
    const query = {};

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.categories = { $in: [category] };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    // Get products with pagination
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination metadata
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
