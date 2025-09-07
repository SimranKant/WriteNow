const User = require("../models/users.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");

const upload = multer({ storage });

module.exports.uploadProfile = upload.single("profilePicture");

// Register
module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, age, bio } = req.body;
    const newUser = new User({ username, email, age, bio });

    if (req.file) {
      newUser.profilePicture = {
        url: req.file.path,
        filename: req.file.filename,
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

// Login
module.exports.getLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to WriteNow");
  const redirectUrl = res.locals.redirectUrl || "/posts";
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out");
    res.redirect("/posts");
  });
};

// Show Profile
module.exports.showProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/posts");
  }
  res.render("users/profile.ejs", { user });
};

// Edit Profile Form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  if (!req.user || req.user._id.toString() !== id) {
    req.flash("error", "You are not authorized to edit this profile.");
    return res.redirect(`/users/${id}`);
  }
  const user = await User.findById(id);
  res.render("users/edit.ejs", { user });
};

// Update Profile
module.exports.updateProfile = async (req, res) => {
  const { id } = req.params;

  if (!req.user || req.user._id.toString() !== id) {
    req.flash("error", "You are not authorized to update this profile.");
    return res.redirect(`/users/${id}`);
  }

  const { username, email, age, bio, password } = req.body;
  const updatedUser = await User.findById(id);

  let requiresPassword = false;

  // ✅ Check if email or username is changing
  if (email !== updatedUser.email || username !== updatedUser.username) {
    requiresPassword = true;

    if (!password) {
      req.flash("error", "Password is required to update username or email.");
      return res.redirect(`/users/${id}/edit`);
    }

    const isValid = await updatedUser.authenticate(password);
    if (!isValid.user) {
      req.flash("error", "Incorrect password. Changes not saved.");
      return res.redirect(`/users/${id}/edit`);
    }
  }

  // ✅ Apply changes
  updatedUser.username = username;
  updatedUser.age = age;
  updatedUser.bio = bio;

  if (!requiresPassword || (requiresPassword && password)) {
    updatedUser.email = email;
  }

  // ✅ Handle new profile picture
  if (req.file) {
    updatedUser.profilePicture = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await updatedUser.save();

  req.flash("success", "Profile updated successfully!");
  res.redirect(`/users/${id}`);
};


