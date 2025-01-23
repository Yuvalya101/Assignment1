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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const userInfo = {
    email: "yuval@gmail.com",
    password: "123456",
    userName: "yuvalavi",
};
const testPost1 = {
    title: "My First post",
    content: "This is my first post",
};
const testPost2 = {
    title: "My First post 2",
    content: "This is my first post 2",
};
const testPostFail = {
    content: "This is my first post 2",
};
describe("Posts Tests", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield (0, server_1.initApp)();
        yield user_model_1.default.deleteMany();
        yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
        userInfo.token = response.body.accessToken;
        userInfo._id = response.body._id;
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield post_model_1.default.deleteMany();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    test("Posts Create test", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(userInfo);
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPost1);
        const post = response.body;
        expect(response.statusCode).toBe(201);
        expect(post.sender).toBe(userInfo._id);
        expect(post.title).toBe(testPost1.title);
        expect(post.content).toBe(testPost1.content);
    }));
    test("Posts Get All test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/posts")
            .set("authorization", "JWT " + userInfo.token);
        expect(response.statusCode).toBe(200);
    }));
    test("Posts Get By Id test", () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: createdPost } = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPost1);
        const response = yield (0, supertest_1.default)(app)
            .get("/posts/" + createdPost._id)
            .set("authorization", "JWT " + userInfo.token);
        const post = response.body;
        console.log("/posts/" + createdPost._id);
        console.log(post);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
    }));
    test("Posts Get By Id test fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/posts/" + "8478" + "3")
            .set("authorization", "JWT " + userInfo.token);
        const post = response.body;
        expect(response.statusCode).toBe(400);
    }));
    test("Posts Create test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPost2);
        console.log(response.body);
        const post = response.body;
        expect(response.statusCode).toBe(201);
        expect(post.title).toBe(testPost2.title);
        expect(post.content).toBe(testPost2.content);
    }));
    test("Posts Create test fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPostFail);
        expect(response.statusCode).not.toBe(201);
    }));
    test("Posts get posts by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPost1);
        const response = yield (0, supertest_1.default)(app)
            .get("/posts?sender=" + userInfo._id)
            .set("authorization", "JWT " + userInfo.token);
        const post = response.body[0];
        expect(response.statusCode).toBe(200);
        expect(post.sender).toBe(userInfo._id);
        expect(response.body.length).toBe(1);
    }));
    test("Posts Delete test", () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: createdPost } = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPost1);
        const response = yield (0, supertest_1.default)(app)
            .delete("/posts/" + createdPost._id)
            .set("authorization", "JWT " + userInfo.token);
        expect(response.statusCode).toBe(204);
        const respponse2 = yield (0, supertest_1.default)(app)
            .get("/posts/" + createdPost._id)
            .set("authorization", "JWT " + userInfo.token);
        console.log(createdPost, respponse2.body);
        expect(respponse2.statusCode).toBe(404);
    }));
});
