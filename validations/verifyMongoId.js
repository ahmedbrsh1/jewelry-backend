const { body, param } = require("express-validator");

const location = (field, location) => {
  if (location === "body") {
    return body(field);
  } else {
    return param(field);
  }
};

const verifyMongoId = (field, Schema, locationParam) => {
  return location(field, locationParam)
    .trim()
    .notEmpty()
    .withMessage(`${field} required`)
    .bail()
    .isMongoId()
    .withMessage(`${field} isn't a valid MongoDB ObjectId`)
    .bail()
    .custom(async (value) => {
      const document = await Schema.findById(value);
      if (!document) {
        throw new Error(`${field} does not exist`);
      }
      return true;
    });
};

module.exports = { verifyMongoId };
