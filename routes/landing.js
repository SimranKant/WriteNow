const express = require("express");
const router = express.Router();
const Post = require("../models/posts.js");

// Landing Page
router.get("/", async (req, res) => {
  try {
    const popularPosts = await Post.find({})
      .sort({ likesCount: -1 }) // assuming you have likesCount
      .limit(3) // show only top 3 posts
      .populate("author"); // populate author info

    res.render("landing/landing", { popularPosts });
  } catch (err) {
    console.error(err);
    res.render("landing/landing", { popularPosts: [] });
  }
});

module.exports = router;
