const User = require("../models/users.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

module.exports.uploadProfile = upload.single("profilePicture");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, age, bio } = req.body;
    const newUser = new User({ username, email, age, bio });

    // If a file is uploaded
    if (req.file) {
      newUser.profilePicture.url = `/uploads/${req.file.filename}`;
      newUser.profilePicture.filename = req.file.filename;
    }

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to WriteNow");
      res.redirect("/posts");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to WriteNow");
  const redirectUrl = res.locals.redirectUrl || "/posts";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out");
    res.redirect("/posts");
  });
};

