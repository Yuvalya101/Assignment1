const express = require("express");
const router = express.Router();
const Post = require("../controllers/post_controllers");

router.post("/", Post.addNewPost);

router.get("/", Post.getAllPosts);

router.get("/:id", Post.getAPostByID);

router.put("/:id", Post.updatePost);

module.exports = router;
