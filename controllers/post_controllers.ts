import { Request, Response } from "express";
import Posts from "../models/post_model";
import createController from "./base_controller";

const postController = createController(Posts);

const addNewPost = async (req: Request, res: Response) => {
  return postController.post(req, res);
};

const getAllPosts = async (req: Request, res: Response) => {
  const filter = req.query.sender ? { sender: req.query.sender } : {};
  return postController.get(req, res, filter);
};

const getAPostByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  return postController.getById(req, res, id);
};

const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  return postController.put(req, res, id);
};

const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  return postController.delete(req, res, id);
};

export default {
  addNewPost,
  getAPostByID,
  getAllPosts,
  updatePost,
  deletePost,
};
