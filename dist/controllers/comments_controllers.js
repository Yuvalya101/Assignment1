"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_model_1 = __importDefault(require("../models/comments_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const controller = (0, base_controller_1.default)(comments_model_1.default);
// Add a new comment
const addNewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return controller.post(req, res);
});
// Get all comments
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return controller.get(req, res);
});
// Get comments by post ID
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    return controller.get(req, res, { postId });
});
// Update a comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    return controller.put(req, res, id);
});
// Delete a comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    return controller.delete(req, res, id);
});
exports.default = {
    addNewComment,
    getAllComments,
    getCommentsByPostId,
    updateComment,
    deleteComment,
};
