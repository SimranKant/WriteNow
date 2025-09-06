const User = require("../models/users.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { storage } = require("../cloudConfig.js");

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
  newUser.profilePicture = {
    url: req.file.path,       // 👈 Cloudinary secure URL
    filename: req.file.filename, // 👈 Cloudinary public_id
  };
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
// Edit Profile Form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  if (!req.user || req.user._id.toString() !== id) {
    req.flash("error", "You are not authorized to edit this profile.");
    return res.redirect(`/${id}`);
  }
  const user = await User.findById(id);
  res.render("users/edit.ejs", { user });
};

// Update Profile
module.exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  if (!req.user || req.user._id.toString() !== id) {
    req.flash("error", "You are not authorized to update this profile.");
    return res.redirect(`/${id}`);
  }

  const { email, age, bio } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { email, age, bio },
    { new: true }
  );

  // If a new profile picture is uploaded
  if (req.file) {
    updatedUser.profilePicture = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await updatedUser.save();
  }

  req.flash("success", "Profile updated successfully!");
  res.redirect(`/${id}`);
};
