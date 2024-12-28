import express from "express";
import Post from "../controllers/post_controllers";

const router = express.Router();

router.post("/", Post.addNewPost);

router.get("/:id", Post.getAPostByID);

router.get("/", Post.getAllPosts);

router.put("/:id", Post.updatePost);

export default router;
