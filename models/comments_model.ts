import mongoose from "mongoose";

const Schema = mongoose.Schema;
const commentSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId in another collection
    ref: "Posts", // Reference the 'Posts' model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: String,
  sender: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comments", commentSchema);
export default Comment;
