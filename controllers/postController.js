const { validationResult } = require("express-validator");
const pgPool = require("../db/pool");
const { reformatErrors } = require("../validators/reformatter");

const createPostGet = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("You must be logged in to view posts"));
  }
  res.render("createPost");
};

const createPostPost = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("You must be logged in to create posts"));
  }

  const title = req.body.title;
  const body = req.body.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("createPost", {
      errors: reformatErrors(errors.array()),
      title,
      body,
    });
    return;
  }

  try {
    const queryResult = await pgPool.query(
      `
            INSERT INTO posts(title, body, author_id)
            VALUES($1, $2, $3);
      `,
      [title, body, req.user.id]
    );
    if (queryResult && queryResult.rowCount === 0) {
      return next(new Error("Failed to create post"));
    }
  } catch (err) {
    return next(err);
  }
  res.redirect("/");
};

const deletePostPost = async (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.is_admin) {
    return next(new Error("Must be an admin to delete post"));
  }

  if (!req.params.id) {
    return next(new Error("Not a valid post"));
  }

  try {
    const queryResult = await pgPool.query(
      `
            DELETE FROM posts
            WHERE id=$1;
        `,
      [req.params.id]
    );
    if (queryResult && queryResult.rowCount > 0) {
      res.redirect("/");
    } else {
      return next(new Error("Something went wrong while deleting this post"));
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createPostGet,
  createPostPost,
  deletePostPost,
};
