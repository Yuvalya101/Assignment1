const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({

  postId: {
    type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId in another collection
    ref: "Posts", // Reference the 'Posts' model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comments", commentSchema);
module.exports = Comment;
