import { Request, Response } from "express";
import { FilterQuery, Model } from "mongoose";

class BaseController<T> {
  constructor(private readonly model: Model<T>) {}
  async post(req: Request, res: Response) {
    const obj = new this.model(req.body);
    try {
      const savedObj = await obj.save();
      res.status(201).send(savedObj);
    } catch (error: any) {
      res.status(401).send(error.message);
    }
  }

  async get(req: Request, res: Response, query: FilterQuery<T> = {}) {
    try {
      const objs = await this.model.find(query);
      res.send(objs);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  async getById(req: Request, res: Response, _id: string) {
    try {
      const obj = await this.model.findOne({ _id });
      if (!obj) {
        res.status(404).send("Not Found");
        return;
      }
      res.send(obj);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  async put(req: Request, res: Response, id: string) {
    if (id) {
      try {
        const obj = req.body;
        const update = await this.model.findByIdAndUpdate(id, obj, {
          new: true,
        });
        res.status(200).send(update);
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    } else {
      res.status(400).send("Update Error");
    }
  }

  async delete(req: Request, res: Response, id: string) {
    if (id) {
      try {
        await this.model.findByIdAndDelete(id);
        res.status(204).send();
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    } else {
      res.status(400).send("Delete Error");
    }
  }
}

const createController = <T>(model: Model<T>) => new BaseController(model);
export default createController;
