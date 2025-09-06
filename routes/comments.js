const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { commentSchema } = require("../schema.js");
const mongoose = require("mongoose");
const Comment = require("../models/comments.js");
const Post = require("../models/posts.js");
const Controller = require("../controllers/comments.js");
const {
  validateReview,
  isLoggedIn,
  isCommentOwner,
  validateComment,
} = require("../middleware.js");

// Comments
// Create Comment
router.post(
  "/",
  isLoggedIn,
  validateComment,
  wrapAsync(Controller.createComment)
);

// Delete Comment
router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentOwner,
  wrapAsync(Controller.deleteComment)
);

module.exports = router;
