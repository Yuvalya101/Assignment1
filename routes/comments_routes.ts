import express from "express";
import Comment from "../controllers/comments_controllers";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.use(authMiddleware);
// CRUD operations for comments

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment related endpoints
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment
 *     description: Creates a new comment.
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               comment:
 *                 type: string
 *                 example: "This is a comment."
 *               sender:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

router.post("/", Comment.addNewComment); // Create a new comment

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieves all comments.
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get("/", Comment.getAllComments); // Get all comments

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by Post ID
 *     description: Retrieves a comment by its post ID.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

router.get("/:postId", Comment.getCommentsByPostId); // Get comments for a specific post

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Updates a comment by its ID.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Updated comment."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

router.put("/:id", Comment.updateComment); // Update a specific comment

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment by its ID.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

router.delete("/:id", Comment.deleteComment); // Delete a specific comment

export default router;
