const mongoose = require("mongoose");
const Product = require("./Product");

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    rating: { type: Number, required: true },
    review: { type: String },
  },
  { timestamps: true }
);

ReviewSchema.pre("save", async function (next) {
  try {
    const reviews = await Review.find({ productId: this.productId });
    const sumRatings = reviews.reduce(
      (sum, current) => sum + current.rating,
      0
    );
    const averageRating = sumRatings / reviews.length;

    await Product.findByIdAndUpdate(this.productId, {
      rating: averageRating,
    });

    next();
  } catch (error) {
    next(error);
  }
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
