import {Schema, model} from "mongoose";

interface Post {
  title: string;
  content: string;
  sender: string;
} 

const postSchema = new Schema<Post>({
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

const Posts = model<Post>("Posts", postSchema);
export default Posts;
