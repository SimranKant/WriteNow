const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  bio: { type: String, default: "" },
  profilePicture: {
    url: String,
    filename: String,
  },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});
// Virtual field for liked posts
userSchema.virtual("likedPosts", {
  ref: "Post",
  localField: "_id",
  foreignField: "likedBy",
});

// Enable virtuals in JSON and Object output
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

// Use email as the login field
userSchema.plugin(passportLocalMongoose, { usernameField: "username" });

module.exports = mongoose.model("User", userSchema);
