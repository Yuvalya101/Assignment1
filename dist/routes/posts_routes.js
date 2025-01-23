"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controllers_1 = __importDefault(require("../controllers/post_controllers"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *  name: Post
 *  description: The Post API
 */
router.use(auth_controller_1.authMiddleware);
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     description: Creates a new post.
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Post"
 *               content:
 *                 type: string
 *                 example: "This is the content of my first post."
 *               sender:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", post_controllers_1.default.addNewPost);
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieves a post by its ID.
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", post_controllers_1.default.getAPostByID);
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieves all posts.
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", post_controllers_1.default.getAllPosts);
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: Updates a post by its ID.
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the post."
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", post_controllers_1.default.updatePost);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes a post by its ID.
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", post_controllers_1.default.deletePost);
exports.default = router;
