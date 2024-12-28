import express from "express";
import Comment from "../controllers/comments_controllers";

const router = express.Router();

// CRUD operations for comments
router.post("/", Comment.addNewComment); // Create a new comment

router.get("/", Comment.getAllComments); // Get all comments

router.get("/:postId", Comment.getCommentsByPostId); // Get comments for a specific post

router.put("/:id", Comment.updateComment); // Update a specific comment

router.delete("/:id", Comment.deleteComment); // Delete a specific comment

export default router;
