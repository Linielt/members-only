const pgPool = require("../db/pool");

const indexGet = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("index");
    return;
  }

  const postList = await pgPool.query(
    `
    SELECT * FROM posts ORDER BY created_at LIMIT $1 OFFSET $2;
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
