import { Request, Response } from "express";
import Comments from "../models/comments_model";

// Add a new comment
const addNewComment = async (req:Request, res:Response) => {
  try {
    const comment = await Comments.create(req.body);
    res.status(201).send(comment);
  } catch (error:any) {
    res.status(400).send(error.message);
  }
};

// Get all comments
const getAllComments = async (req:Request, res:Response) => {
  try {
    const comments = await Comments.find();
    res.send(comments);
  } catch (error:any) {
    res.status(400).send(error.message);
  }
};

// Get comments by post ID
const getCommentsByPostId = async (req:Request, res:Response) => {
  try {
    const postId = req.params.postId;
    const comments = await Comments.find({ postId });
    res.send(comments);
  } catch (error:any) {
    res.status(400).send(error.message);
  }
};

// Update a comment
const updateComment = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const updatedComment = await Comments.findByIdAndUpdate(id, req.body, { new: true });
    res.send(updatedComment);
  } catch (error:any) {
    res.status(400).send(error.message);
  }
};

// Delete a comment
const deleteComment = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    await Comments.findByIdAndDelete(id);
    res.status(200).send({ message: "Comment deleted successfully" });
  } catch (error:any) {
    res.status(400).send(error.message);
  }
};

export default{
  addNewComment,
  getAllComments,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
