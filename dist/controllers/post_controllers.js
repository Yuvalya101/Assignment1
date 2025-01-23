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
const post_model_1 = __importDefault(require("../models/post_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const postController = (0, base_controller_1.default)(post_model_1.default);
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.sender = req.query.userId;
    var result = yield postController.post(req, res);
    return result;
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.sender ? { sender: req.query.sender } : {};
    console.log("Sender Query:", req.query.sender);
    return yield postController.get(req, res, filter);
});
const getAPostByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    return yield postController.getById(req, res, id);
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    return yield postController.put(req, res, id);
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    return yield postController.delete(req, res, id);
});
exports.default = {
    addNewPost,
    getAPostByID,
    getAllPosts,
    updatePost,
    deletePost,
};
