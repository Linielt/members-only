const { validationResult } = require("express-validator");
const pgPool = require("../db/pool");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { reformatErrors } = require("../validators/reformatter");

const userSignUpGet = async (req, res) => {
  res.render("signup");
};

const userSignUpPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("signup", {
      errors: reformatErrors(errors.array()),
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await pgPool.query(
      `
           INSERT INTO users (first_name, last_name, username, password, is_admin, membership_status)
           VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        req.body.firstname,
        req.body.lastname,
        req.body.username,
        hashedPassword,
        false,
        "user",
      ]
    );
    res.redirect("login");
  } catch (err) {
    return next(err);
  }
};

const userLoginGet = async (req, res) => {
  res.render("login");
};

const userLoginPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("login", {
      errors: reformatErrors(errors.array()),
    });
    return;
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        errors: { userNotFound: "Incorrect username or password" },
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

const userLogoutGet = async (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const joinClubGet = (req, res) => {
  if (!req.isAuthenticated()) {
    return next(new Error("Unauthorized Access Denied"));
  }

  res.render("joinTheClub");
};

const joinClubPost = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("Unauthorized Access Denied"));
  }

  if (req.body.passcode == process.env.PASSCODE) {
    try {
      await pgPool.query(
        `
          UPDATE users
          SET membership_status = 'member'
          WHERE id = $1;
        `,
        [req.user.id]
      );
    } catch (err) {
      return next(err);
    }
  } else {
    return res.render("joinTheClub", {
      errors: { incorrectPasscode: "You entered the incorrect passcode!" },
    });
  }

  return res.redirect("/");
};

module.exports = {
  userSignUpGet,
  userSignUpPost,
  userLoginGet,
  userLoginPost,
  userLogoutGet,
  joinClubGet,
  joinClubPost,
};
