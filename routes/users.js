const express = require("express");

const CustomError = require("../errors/custom-error");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  authenticationMiddleware,
  userAuthorizationMiddleware,
} = require("../middleware/authentication");
const {
  loginValidations,
  registerValidations,
} = require("../validations/userValidations");
const validator = require("../middleware/validator");

router.post("/login", loginValidations, validator, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(401, "Invalid Credentials");
  }
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    throw new CustomError(401, "Invalid Credentials");
  }

  const token = user.createToken();

  res.status(200).json({ token });
});
router.post("/register", registerValidations, validator, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  const user = await User.create(req.body);
  const token = user.createToken();
  res.status(201).json({ token });
});

router.use(authenticationMiddleware);

router.param("userId", userAuthorizationMiddleware);

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError(404, "User not found");
  }
  res.status(200).json(user);
});

router.patch("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new CustomError(404, "User not found");
  }
  res.status(200).json(user);
});
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new CustomError(404, "User not found");
  }
  res.status(200).json(user);
});

module.exports = router;
