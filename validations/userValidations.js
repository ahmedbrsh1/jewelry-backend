const { body } = require("express-validator");

const loginValidations = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email required!")
    .bail()
    .isEmail()
    .withMessage("Invalid email format!")
    .normalizeEmail(),
];

const registerValidations = [
  ...loginValidations,
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password required!")
    .bail()
    .isStrongPassword()
    .withMessage("Password not strong enough!"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address required!")
    .bail()
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phonenumber required!")
    .bail()
    .isMobilePhone("ar-EG")
    .withMessage("Please provide a valid phonenumber"),
];

module.exports = { loginValidations, registerValidations };
