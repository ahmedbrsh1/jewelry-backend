const { body } = require("express-validator");

const orderValidations = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Your cart must contain at least one item."),

  body("items.*.productId")
    .trim()
    .notEmpty()
    .withMessage("productId required")
    .bail()
    .isMongoId()
    .withMessage("productId isn't a mongo Id"),
  body("items.*.quantity")
    .trim()
    .notEmpty()
    .withMessage("quantity required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer"),
  body("items.*.size").trim().notEmpty().withMessage("size required"),
  body("items.*.color").trim().notEmpty().withMessage("color required"),

  body("createdBy")
    .trim()
    .notEmpty()
    .withMessage("userId required")
    .bail()
    .isMongoId()
    .withMessage("Invalid user."),
  body("totalPrice")
    .isFloat({ min: 1.0 })
    .withMessage("Total price must be a positive number."),
  body("paymentMethod")
    .trim()
    .isEmpty()
    .withMessage("Payment method required!"),
  body("shippingAddress")
    .trim()
    .isEmpty()
    .withMessage("Shipping address required!"),
];

module.exports = orderValidations;
