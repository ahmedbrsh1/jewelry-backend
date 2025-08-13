const jwt = require("jsonwebtoken");
const CustomError = require("../errors/custom-error");
require("dotenv").config();
const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new CustomError(401, "401 Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    throw new CustomError(401, "401 Unauthorized");
  }
};

const adminAuthMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new CustomError(401, "401 Unauthorized");
  }
  next();
};

const userAuthorizationMiddleware = (req, res, next, userId) => {
  if (req.user.userId !== userId) {
    throw new CustomError(401, "401 Unauthorized");
  }
  next();
};

module.exports = {
  authenticationMiddleware,
  adminAuthMiddleware,
  userAuthorizationMiddleware,
};
