"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controllers_1 = __importDefault(require("../controllers/comments_controllers"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
router.use(auth_controller_1.authMiddleware);
// CRUD operations for comments
router.post("/", comments_controllers_1.default.addNewComment); // Create a new comment
router.get("/", comments_controllers_1.default.getAllComments); // Get all comments
router.get("/:postId", comments_controllers_1.default.getCommentsByPostId); // Get comments for a specific post
router.put("/:id", comments_controllers_1.default.updateComment); // Update a specific comment
router.delete("/:id", comments_controllers_1.default.deleteComment); // Delete a specific comment
exports.default = router;
