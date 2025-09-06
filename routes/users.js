const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const {
  renderRegisterForm,
  register,
  getLoginForm,
  login,
  logout,
  uploadProfile,
} = require("../controllers/users.js");

// Register routes
router.get("/register", renderRegisterForm);
router.post("/register", uploadProfile, wrapAsync(register));

// Login routes
router.get("/login", getLoginForm);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(login)
);



// Logout
router.get("/logout", logout);

module.exports = router;
