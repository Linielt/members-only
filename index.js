const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const pgPool = require("./db/pool");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");

app.use("/public", express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new (require("connect-pg-simple")(session))({
      pool: pgPool,
      tableName: "session",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pgPool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pgPool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/auth", authRouter);
app.use((req, res, next) => {
  res.locals.user = req.user;
  console.log(req.user);
  next();
});
app.use("/post", postRouter);
app.use("/", indexRouter);

app.use((err, req, res, next) => {
  res
    .status(500)
    .render("error", { errorMessage: err.message || "Something went wrong " });
});

app.use((err, req, res, next) => {
  res
    .status(401)
    .render("error", { errorMessage: err.message || "Unauthorized access" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
