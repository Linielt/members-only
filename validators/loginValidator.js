const { body } = require("express-validator");

const validateLogin = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 255 })
    .withMessage("Must be a valid email address"),
  body("password")
    .trim()
    .isLength({ min: 8, max: 24 })
    .withMessage("Password must be 8 to 24 characters long"),
];

module.exports = validateLogin;
