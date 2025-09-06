const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Post = require("../models/posts.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validatePost } = require("../middleware.js");
const Controller = require("../controllers/posts.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route
router.get("/", wrapAsync(Controller.index));

// New Route
router.get("/new", isLoggedIn, Controller.renderNewForm);
router.get("/search", Controller.search);

// Create Route
router.post(
  "/",
  isLoggedIn,
  upload.single("post[image]"),
  validatePost,
  wrapAsync(Controller.createPost)
);

// Show Route
router.get("/:id", wrapAsync(Controller.showPost));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(Controller.renderEditForm)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  upload.single("post[image]"),
  validatePost,
  wrapAsync(Controller.editPost)
);

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(Controller.deletePost));

module.exports = router;
