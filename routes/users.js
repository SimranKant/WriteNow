const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");  
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/users.js");

const { saveRedirectUrl,isLoggedIn } = require("../middleware.js");
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
// Logout
router.get("/logout", logout);

router.get("/:id/edit", isLoggedIn, users.renderEditForm);

// Update profile with multer
router.put(
  "/:id",
  isLoggedIn,
  users.uploadProfile, 
  wrapAsync(users.updateProfile)
);

// routes/users.js
router.get("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .populate({
      path: "likedPosts",
      populate: { path: "author" }
    });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/posts");
  }

  const Post = require("../models/posts");
  const myPosts = await Post.find({ author: id }).populate("author");

  res.render("users/dashboard.ejs", { user, myPosts });
});





module.exports = router;
