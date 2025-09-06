const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: String,
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});

const Comment = mongoose.model("Comment",commentSchema);
module.exports=Comment;