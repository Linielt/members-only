const express = require("express");
const {
  createPostGet,
  createPostPost,
  deletePostPost,
} = require("../controllers/postController");
const postValidator = require("../validators/postValidator");

const router = express.Router();

router.get("/create-post", createPostGet);
router.post("/create-post", postValidator, createPostPost);
router.post("/delete/:id", deletePostPost);

module.exports = router;
