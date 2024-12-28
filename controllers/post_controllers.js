const { json } = require("express");
const { db } = require("../models/post_model");
const Posts = require("../models/post_model");

const addNewPost = async (req, res) => {
  console.log(req.body);
  try {
    const post = await Posts.create(req.body);
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send();
  }
};

const getAllPosts = async (req, res) => {
  const filter = req.query;
  try {
    if (filter.sender) {
      const posts = await Posts.find({ sender: filter.sender });
      return res.send(posts);
    } else {
      const posts = await Posts.find();
      return res.send(posts);
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const getAPostByID = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findById(id);
    res.send(post);
  } catch (error) {
    res.status(400).send({ error: "Invalid ID or server error" });
  }
};

const updatePost = async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const post = req.body;
      const update = await Posts.findByIdAndUpdate(id, post, { new: true });
      return res.status(200).send(update);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  } else {
    console.log("Update Post Error");
  }
};


const deletePost = async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const post = await Posts.findByIdAndDelete(id);
      return res.status(200).send(post);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  } else {
    console.log("Delete Post Error");
  }
};

module.exports = {
  addNewPost,
  getAPostByID,
  getAllPosts,
  updatePost,
  deletePost,
};
