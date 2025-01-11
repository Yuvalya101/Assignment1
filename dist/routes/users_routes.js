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
router.post("/", user_controller_1.default.newUser);
router.get("/", user_controller_1.default.getAllUsers);
router.get("/:id", user_controller_1.default.getUserById);
router.put("/:id", user_controller_1.default.updateUser);
router.delete("/:id", user_controller_1.default.deleteUser);
exports.default = router;
