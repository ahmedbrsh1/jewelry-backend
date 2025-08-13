const express = require("express");

const Product = require("../models/Product");
const CustomError = require("../errors/custom-error");
const {
  authenticationMiddleware,
  adminAuthMiddleware,
} = require("../middleware/authentication");
const Review = require("../models/Review");
const reviewValidations = require("../validations/reviewValidations");
const validator = require("../middleware/validator");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById({ _id: productId }).populate(
    "reviews"
  );
  if (!product) {
    throw new CustomError(404, "Product not found");
  }
  res.json(product);
});

router.use(authenticationMiddleware);
router.post(
  "/:productId/reviews",
  reviewValidations,
  validator,
  async (req, res) => {
    const review = await Review.create({
      productId: req.params.productId,
      createdBy: req.user.userId,
      ...req.body,
    });

    res.status(201).json(review);
  }
);

router.use(adminAuthMiddleware);

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});
router.patch("/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError(404, "Product not found");
  }
  res.status(200).json(product);
});
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new CustomError(404, "Product not found");
  }
  res.status(200).json(product);
});

module.exports = router;
