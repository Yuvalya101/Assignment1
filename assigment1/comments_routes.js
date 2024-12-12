const express = require("express");
const router = express.Router();
const Comment = require("../controllers/comments_controllers");

// CRUD operations for comments
router.post("/", Comment.addNewComment); // Create a new comment

router.get("/", Comment.getAllComments); // Get all comments

router.get("/:postId", Comment.getCommentsByPostId); // Get comments for a specific post

router.put("/:id", Comment.updateComment); // Update a specific comment

router.delete("/:id", Comment.deleteComment); // Delete a specific comment

module.exports = router;
