const { body } = require("express-validator");

const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage("Title must be between 3 to 64 characters long"),
  body("body")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Body must be at least 3 characters long"),
];

module.exports = validatePost;
