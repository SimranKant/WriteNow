const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");  
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/users.js");

const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

// Controllers you already have
const {
  renderRegisterForm,
  register,
  getLoginForm,
  login,
  logout,
  uploadProfile,
} = require("../controllers/users.js");

// ---------- AUTH ROUTES ----------

// Register
router.get("/register", renderRegisterForm);
router.post("/register", uploadProfile, wrapAsync(register));

// Login
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

// ---------- PROFILE ROUTES ----------

// Edit Profile
router.get("/:id/edit", isLoggedIn, users.renderEditForm);
router.put("/:id", isLoggedIn, users.uploadProfile, wrapAsync(users.updateProfile));

// User Dashboard
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .populate({ path: "likedPosts", populate: { path: "author" } });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/posts");
  }

  const Post = require("../models/posts");
  const myPosts = await Post.find({ author: id }).populate("author");

  res.render("users/dashboard.ejs", { user, myPosts, currUser: req.user });

}));



// Follow
router.post("/:id/follow", users.followUser);

// Unfollow
router.post("/:id/unfollow", users.unfollowUser);





module.exports = router;
