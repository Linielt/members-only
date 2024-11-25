const { body } = require("express-validator");

const validateSignUp = [
  body("firstname")
    .trim()
    .isAlpha()
    .withMessage("First name must be alphanumeric")
    .isLength({ min: 3, max: 64 })
    .withMessage("First name must be between 3 and 64 characters long"),

  body("lastname")
    .trim()
    .isAlpha()
    .withMessage("Last name must be alphanumeric")
    .isLength({ min: 3, max: 64 })
    .withMessage("Last name must be between 3 and 64 characters long"),

  body("username")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address"),

  body("password")
    .trim()
    .isLength({ min: 8, max: 24 })
    .withMessage("Password must be at least 8 to 24 characters long"),
];

module.exports = validateSignUp;
