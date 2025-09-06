const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comments");
const { required } = require("joi");

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Cascade delete comments when a post is deleted
postSchema.post("findOneAndDelete", async (post) => {
  if (post) {
    await Comment.deleteMany({ _id: { $in: post.comments } });
  }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
