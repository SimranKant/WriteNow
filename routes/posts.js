const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Post = require("../models/posts.js");
const { isLoggedIn, isOwner, validatePost } = require("../middleware.js");
const Controller = require("../controllers/posts.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ===== Posts Routes =====

// Index Route - show all posts
router.get("/", wrapAsync(Controller.index));

// New Post Form
router.get("/new", isLoggedIn, Controller.renderNewForm);

// Search Route
router.get("/search", Controller.search);

// Create Post
router.post(
  "/",
  isLoggedIn,
  upload.single("post[image]"),
  validatePost,
  wrapAsync(Controller.createPost)
);

// Show Post
router.get("/:id", wrapAsync(Controller.showPost));

// Like / Unlike Post
router.post("/:id/like", isLoggedIn, wrapAsync(Controller.toggleLike));

// Edit Post Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(Controller.renderEditForm));

// Update Post
router.put(
  "/:id",
  isLoggedIn,
  upload.single("post[image]"),
  validatePost,
  wrapAsync(Controller.editPost)
);

// Delete Post
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(Controller.deletePost));

module.exports = router;
