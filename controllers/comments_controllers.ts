import { Request, Response } from "express";
import Comments from "../models/comments_model";
import createController from "./base_controller";

const controller = createController(Comments);

// Add a new comment
const addNewComment = async (req: Request, res: Response) => {
  return controller.post(req, res);
};

// Get all comments
const getAllComments = async (req: Request, res: Response) => {
  return controller.get(req, res);
};

// Get comments by post ID
const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  return controller.get(req, res, { postId });
};

// Update a comment
const updateComment = async (req: Request, res: Response) => {
  const id = req.params.id;
  return controller.put(req, res, id);
};

// Delete a comment
const deleteComment = async (req: Request, res: Response) => {
  const id = req.params.id;
  return controller.delete(req, res, id);
};

export default {
  addNewComment,
  getAllComments,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
