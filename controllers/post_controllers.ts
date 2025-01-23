import { Request, Response } from "express";
import Posts from "../models/post_model";
import createController from "./base_controller";

const postController = createController(Posts);

const addNewPost = async (req: Request, res: Response) => {
  req.body.sender = req.query.userId;
  var result = await postController.post(req, res);
  return result;
};

const getAllPosts = async (req: Request, res: Response) => {
  const filter = req.query.sender ? { sender: req.query.sender } : {};
  console.log("Sender Query:", req.query.sender);
  return await postController.get(req, res, filter);
};

const getAPostByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  return await postController.getById(req, res, id);
};

const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  return await postController.put(req, res, id);
};

const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  return await postController.delete(req, res, id);
};

export default {
  addNewPost,
  getAPostByID,
  getAllPosts,
  updatePost,
  deletePost,
};
