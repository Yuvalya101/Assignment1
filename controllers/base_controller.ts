import { Request, Response } from 'express';
import { FilterQuery, Model } from 'mongoose';


class BaseController<T> {
    constructor(private readonly model: Model<T>) {}
    async post(req:Request, res:Response) {
        console.log(req.body);
        const obj = new this.model(req.body);
        try {
            const savedObj = await obj.save();
            res.status(201).send(savedObj);
        } catch (error:any) {
            res.status(400).send();
        }       
    }

    async get(req: Request, res: Response, query: FilterQuery<T> = {}) {
        try {
            const objs = await this.model.find(query);
            res.send(objs);
        } catch (error:any) {
            res.status(400).send(error.message);
        }
    }

    async getById(req: Request, res: Response,id: string) {
        try {
            const obj = await this.model.findById(id);
            res.send(obj);
        } catch (error:any) {
            res.status(400).send(error.message);
        }
    }

    async put(req: Request, res: Response, id: string) {
  if (id) {
    try {
      const obj = req.body;
      const update = await this.model.findByIdAndUpdate(id, obj, { new: true });
      res.status(200).send(update);
    } catch (error:any) {
      res.status(400).send(error.message);
    }
  } else {
    res.status(400).send("Update Error");
}
    }
}

const createController =<T>(model: Model<T>) => new BaseController(model);
export default createController;