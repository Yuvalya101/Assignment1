"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
router.use(auth_controller_1.authMiddleware);
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related endpoints
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     description: Creates a new user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", user_controller_1.default.newUser);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves all users.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", user_controller_1.default.getAllUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves a user by their ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", user_controller_1.default.getUserById);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user by their ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "UpdatedUserName"
 *               email:
 *                 type: string
 *                 example: "updatedemail@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", user_controller_1.default.updateUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", user_controller_1.default.deleteUser);
exports.default = router;
