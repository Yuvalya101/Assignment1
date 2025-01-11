"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId, // Refers to an ObjectId in another collection
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
const Comment = (0, mongoose_1.model)("Comments", commentSchema);
exports.default = Comment;
