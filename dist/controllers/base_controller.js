"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = new this.model(req.body);
            try {
                const savedObj = yield obj.save();
                res.status(201).send(savedObj);
            }
            catch (error) {
                res.status(401).send(error.message);
            }
        });
    }
    get(req_1, res_1) {
        return __awaiter(this, arguments, void 0, function* (req, res, query = {}) {
            try {
                const objs = yield this.model.find(query);
                res.send(objs);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getById(req, res, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = yield this.model.findOne({ _id });
                if (!obj) {
                    res.status(404).send("Not Found");
                    return;
                }
                res.send(obj);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    put(req, res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                try {
                    const obj = req.body;
                    const update = yield this.model.findByIdAndUpdate(id, obj, {
                        new: true,
                    });
                    res.status(200).send(update);
                }
                catch (error) {
                    res.status(400).send(error.message);
                }
            }
            else {
                res.status(400).send("Update Error");
            }
        });
    }
    delete(req, res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                try {
                    yield this.model.findByIdAndDelete(id);
                    res.status(204).send();
                }
                catch (error) {
                    res.status(400).send(error.message);
                }
            }
            else {
                res.status(400).send("Delete Error");
            }
        });
    }
}
const createController = (model) => new BaseController(model);
exports.default = createController;
