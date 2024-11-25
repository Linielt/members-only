const pgPool = require("../db/pool");

const indexGet = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("index");
    return;
  }

  const postList = await pgPool.query(
    `
    SELECT * 
    FROM posts
    INNER JOIN users ON posts.author_id = users.id
    ORDER BY created_at DESC LIMIT $1 OFFSET $2;
    `,
    [5, 0]
  );

  if (postList && postList.rowCount === 0) {
    res.render("index", { posts: [] });
    return;
  }

  res.render("index", { posts: postList.rows });
};

module.exports = { indexGet };
