const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    priceAfterDiscount: { type: Number, required: true },
    color: { type: [String], required: true, enum: ["gold", "silver"] },
    size: { type: [String], required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["charms", "earrings", "rings", "necklace", "bracelets"],
    },
    stock: { type: Number, required: true }, // inventory count  ,
    images: { type: [String], required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
