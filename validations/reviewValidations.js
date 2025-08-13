const { body } = require("express-validator");
const { verifyMongoId } = require("./verifyMongoId");
const Product = require("../models/Product");
const User = require("../models/User");
const reviewValidations = [
  verifyMongoId("productId", Product, "param"),
  verifyMongoId("createdBy", User, "body"),
  body("rating").isInt({ min: 1, max: 5 }),
  body("review").optional(),
];

module.exports = reviewValidations;
