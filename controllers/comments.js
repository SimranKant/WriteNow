const Comment = require("../models/comments.js");
const Post = require("../models/posts.js");

module.exports.createComment = async (req, res) => {
  let post = await Post.findById(req.params.id);
  let newComment = new Comment(req.body);
  newComment.owner = req.user._id;
  post.comments.push(newComment);
  await newComment.save();
  await post.save();
  req.flash("success", "Comment Created");
  res.redirect(`/posts/${req.params.id}`);
};

module.exports.deleteComment = async (req, res) => {
  let { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Comment Deleted");
  res.redirect(`/posts/${id}`);
};
