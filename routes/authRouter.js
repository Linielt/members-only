const { Router } = require("express");
const {
  userSignUpPost,
  userLoginGet,
  userLoginPost,
  userLogoutGet,
  userSignUpGet,
} = require("../controllers/authController");

const router = Router();
const signUpValidator = require("../validators/signupValidator");
const loginValidator = require("../validators/loginValidator");

router.get("/signup", userSignUpGet);

router.post("/signup", signUpValidator, userSignUpPost);

router.get("/login", loginValidator, userLoginGet);

router.post("/login", userLoginPost);

router.get("/logout", userLogoutGet);

module.exports = router;
