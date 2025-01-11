"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controllers_1 = __importDefault(require("../controllers/post_controllers"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
router.use(auth_controller_1.authMiddleware);
router.post("/", post_controllers_1.default.addNewPost);
router.get("/:id", post_controllers_1.default.getAPostByID);
router.get("/", post_controllers_1.default.getAllPosts);
router.put("/:id", post_controllers_1.default.updatePost);
router.delete("/:id", post_controllers_1.default.deletePost);
exports.default = router;
