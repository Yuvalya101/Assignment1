import { Request,Response } from "express";
import User from "../models/user_model";
import createController from "./base_controller";

const controller = createController(User);

const newUser = async (req: Request, res: Response) => {
    return controller.post(req, res);
};

const getAllUsers = async (req: Request, res: Response) => {                        
    return controller.get(req, res);
};

const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    return controller.getById(req, res, id);
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    return controller.put(req, res, id);
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    return controller.delete(req, res, id);
};

export default {
    newUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};

