const Post = require("../models/posts.js");

module.exports.index = async (req, res) => {
  let posts = await Post.find({}).populate("author");
  res.render("posts/index.ejs", { posts });
};

module.exports.renderNewForm = (req, res) => {
  res.render("posts/new.ejs");
};

module.exports.createPost = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let { post } = req.body;
  let newPost = new Post(post);
  newPost.author = req.user._id;
  newPost.image = { url, filename };
  await newPost.save();
  req.flash("success", "New Post Created");
  res.redirect("/posts");
};

module.exports.showPost = async (req, res) => {
  let { id } = req.params;
  let post = await Post.findById(id)
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    })
    .populate("author");
  if (!post) {
    req.flash("error", "Post does not exist!");
    res.redirect("/posts");
  } else {
    res.render("posts/show.ejs", { post });
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let post = await Post.findById(id);
  if (!post) {
    req.flash("error", "Post does not exist!");
    res.redirect("/posts");
  }
  let originalImageUrl = post.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("posts/edit.ejs", { post, originalImageUrl });
};

module.exports.editPost = async (req, res) => {
  let { id } = req.params;
  let { post } = req.body;
  let updatedPost = await Post.findByIdAndUpdate(id, post);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedPost.image = { url, filename };
    await updatedPost.save();
  }
  req.flash("success", "Post Updated");
  res.redirect(`/posts/${id}`);
};

module.exports.deletePost = async (req, res) => {
  let { id } = req.params;
  await Post.findByIdAndDelete(id);
  req.flash("success", "Post Deleted");
  res.redirect("/posts");
};

module.exports.search = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.redirect("/posts");
  }

  try {
    const regex = new RegExp(q, "i");

    const posts = await Post.find({}).populate("author", "username");

    const filteredPosts = posts.filter(
      (post) =>
        regex.test(post.title) ||
        regex.test(post.content) ||
        regex.test(post.author.username)
    );

    if (filteredPosts.length == 0) {
      req.flash("error", "No post found");
      res.redirect("/posts");
    } else {
      res.render("posts/index.ejs", { posts: filteredPosts });
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Internal Server Error");
  }
};
