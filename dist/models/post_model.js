"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
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
const Posts = (0, mongoose_1.model)("Posts", postSchema);
exports.default = Posts;
