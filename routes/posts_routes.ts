import express from "express";
import Post from "../controllers/post_controllers";

const router = express.Router();

router.post("/", Post.addNewPost);

router.get("/", Post.getAllPosts);

router.get("/:id", Post.getAPostByID);

router.put("/:id", Post.updatePost);

export default router;
