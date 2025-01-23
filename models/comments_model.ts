import {Schema, model} from "mongoose";

interface Comment {
  postId: string;
  content: string;
  author: string;
}

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId, // Refers to an ObjectId in another collection
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

const Comment = model<Comment>("Comments", commentSchema);
export default Comment;
