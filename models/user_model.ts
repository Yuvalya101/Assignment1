import { Schema, model } from "mongoose";

interface User {
  userName: string;
  email: string;
  password: string;
  refreshTokens: string[];
}

const userSchema = new Schema<User>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
  }

});

const Users = model<User>("User", userSchema);
export default Users;
